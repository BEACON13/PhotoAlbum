import boto3
import json
import os
from urllib.parse import unquote_plus

s3_client = boto3.client('s3')
rekognition_client = boto3.client('rekognition')


def lambda_handler(event, context):
    print(event)
    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        object_key = unquote_plus(record['s3']['object']['key'])

        print(f"Processing file {object_key} from bucket {bucket_name}")

        try:
            rekognition_response = rekognition_client.detect_labels(
                Image={
                    'S3Object': {
                        'Bucket': bucket_name,
                        'Name': object_key
                    }
                },
                MaxLabels=10
            )
            labels_detected = [label['Name'] for label in rekognition_response['Labels']]
            print(f"Detected labels: {labels_detected}")

            response = s3_client.head_object(Bucket=bucket_name, Key=object_key)
            custom_labels = response['Metadata'].get('x-amz-meta-customlabels', '').split(',')

            document_to_insert = {
                "objectKey": object_key,
                "bucket": bucket_name,
                "createdTimestamp": response['LastModified'].strftime("%Y-%m-%dT%H:%M:%S"),
                "labels": labels_detected + custom_labels
            }

            print("Document to be inserted into ElasticSearch:", json.dumps(document_to_insert, indent=2))

        except Exception as e:
            print(f"Error processing object {object_key} from bucket {bucket_name}: {str(e)}")
            raise e

    return {
        'statusCode': 200,
        'body': json.dumps('Function executed successfully!')
    }
