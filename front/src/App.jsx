import React, { useEffect, useState } from "react";
import axios from "axios";
function App() {
    const axiosInstance = axios.create({
        baseURL: "http://localhost:1234",
    });
    const [auth, setAuth] = useState(false)
    const [workers,setWorkers] = useState([])
    const [activeWorker, setActiveWorker] = useState(null)
    const [modal, setModal] = useState(false)
    useEffect(()=>{
        async function getWorkers(){
            if(auth){

        }else{
            const {data:workers} = await axiosInstance.get(`/`)
            console.log(workers);
            setWorkers(workers)
        }
        }
        getWorkers()
        
    },[])
  return (
    <div className="w-screen">
        {modal && (
            <div className="w-screen h-screen flex flex-col items-center justify-center bg-green-500">
                <img src={`http://localhost:1234/${workers[activeWorker].image}`} alt="" />
                <p>{workers[activeWorker].lastName +" "+ workers[activeWorker].firstName +" "+  workers[activeWorker].middleName}</p>
                <button onClick={()=>{
                    setModal(false)
                    setActiveWorker(null)
                }}>Закрыть</button>
            </div>
        )}
      <div>
        <h1>Авторизация</h1>
        <form>
            <label htmlFor="login">
                Логин
                <input id="login" type="text" />
            </label>
            <label htmlFor="password">
                Пароль
                <input id="password" type="password" />
            </label>
            <button>Авторизоваться</button>
        </form>
      </div>
      <div>
        <h2>Главная страница</h2>
        <table className="w-screen">
            <tr>
                <th>Номер</th>
                <th>Дата добавления</th>
                <th>ФИО</th>
                <th>Изображение</th>
            </tr>
        {workers.map((e,i)=>{
            return <tr key={i}>
                <td>{e.id}</td>
                <td>{e.dateOfAdd}</td>
                <td className="text-center">{e.lastName + " " + e.firstName + " " + e.middleName + " "}</td>
                <td><img className="relative z-10" onClick={()=>{
                    setActiveWorker(e.id-1)
                    setModal(true)
                }} src={`http://localhost:1234/${e.image}`} alt="" /></td>
            </tr>

        })}
        </table>
        
      </div>
    </div>
  );
}
// e.id
// e.dateOfAdd
// e.lastName
// e.firstName
// e.middleName
// e.image
export default App;
