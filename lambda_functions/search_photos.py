import json
import boto3
import os
import requests

AMAZON_LEX_BOT = "PhotoSearch"
LEX_BOT_ALIAS = "search"
USER_ID = "user"


S3_URL = "s3://photos-bucket-2024/"


def post_to_lex(query, user_id=USER_ID):
    """
    Post query to Amazon Lex and return labels
    https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/lex-runtime.html
    """
    client = boto3.client('lex-runtime')
    response = client.post_text(botName=AMAZON_LEX_BOT,
                                botAlias=LEX_BOT_ALIAS,
                                userId=user_id,
                                inputText=query)

    print("lex-response", response)

    labels = ""
    if response['slots']['Label_one']:
        labels = 'labels:' + response['slots']['Label_one']
    if response['slots']['Label_two']:
        labels += '+labels:' + response['slots']['Label_two']
    return labels


def get_photos_ids(labels):
    """
    return ids of photos with desired labels
    """
    # get the elastic search URL from environment variable
    ES_URL = os.getenv('ES_URL')
    ES_ACCOUNT = os.getenv('ES_ACCOUNT')
    ES_PASSWORD = os.getenv('ES_PASSWORD')

    es_auth = (ES_ACCOUNT, ES_PASSWORD)

    URL = ES_URL + "/_search?q=" +str(labels)
    print("URL: ", URL)
    print("Auth: ", es_auth)
    response = requests.get(URL, auth=es_auth).content
    print("Response: ", response)
    data = json.loads(response)
    hits = data["hits"]["hits"]
    id_list = []
    labels_list = []
    for result in hits:
        _id = result["_source"]["objectKey"]
        id_list.append(_id)
        _labels = result["_source"]["labels"]
        labels_list.append(_labels)
    return id_list, labels_list


def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True,
        },
    }


def lambda_handler(event, context):
    query = event['queryStringParameters']['q']

    print(query)
    labels = post_to_lex(query)
    if labels == "":
        response = {"results": []}
    else:
        print(labels)

        id_list, labels_list = get_photos_ids(labels)

        results = []
        for i, l in zip(id_list, labels_list):
            results.append({"url": S3_URL + i, "labels": l})
        print(results)

        response = {"results": results}

    return respond(None, response)