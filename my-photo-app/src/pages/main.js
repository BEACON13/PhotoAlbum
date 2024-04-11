import React,{useState} from 'react';
import Header from '../components/header'
const MainPage =  ()=>{
    const {photoList,setPhotoList} = useState([])
    const {searchValue, setSearchValue} = useState('')


   
    const SerachBox = () =>{
        return(
            <div>
                <input type="text" value={searchValue} onChange={e=>searchValue(e.target.value)} />
                <button >Search</button>
            </div>
        )
    }

    return (
        <div>
            <Header/>
            <SerachBox/>
            <p>My main page content</p>
        </div>
    )
}
export default MainPage;