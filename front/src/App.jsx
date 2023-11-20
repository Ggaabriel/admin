import React, { useEffect, useState } from "react";
import axios from "axios";
function App() {
    const axiosInstance = axios.create({
        baseURL: "http://localhost:1234",
    });
    const [auth, setAuth] = useState(false);

    const [workers, setWorkers] = useState([]);
    const [activeWorker, setActiveWorker] = useState(null);
    const [modal, setModal] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [errorMess, setErrorMess] = useState("");
    const [editModal, setEditModal] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [birthday, setBirthday] = useState("");

    const [file, setFile] = useState("");

    const [deleteModal, setDeleteModal] = useState(false);

    const [addModal, setAddModal] = useState(false);

    const [numberSort, setNumberSort] = useState(false);
    const [dateSort, setDateSort] = useState(false);
    const [lastNameSort, setLastNameSort] = useState(false);
    async function handleAuth(e) {
        e.preventDefault();
        axiosInstance
            .post("/login", {
                login: login,
                password: password,
            })
            .then((data) => {
                setErrorMess("");
                localStorage.setItem("token", data.data.token);
                setAuth(true);
                console.log(data);
            })
            .catch((err) => {
                setErrorMess(err.response.data.message);
            });
    }
    async function handleEdit(e) {
        const formData = new FormData();
        if (file !== "") {
            formData.append("file", file);
            await axiosInstance.patch(`/worker/${workers[activeWorker].id}`, {
                lastName: lastName,
                firstName: firstName,
                middleName: middleName,
                birthday: birthday,
            });
            await axiosInstance.post(`/worker/${workers[activeWorker].id}/upload`, formData);
            setFile("");
        } else {
            await axiosInstance.patch(`/worker/${workers[activeWorker].id}`, {
                lastName: lastName,
                firstName: firstName,
                middleName: middleName,
                birthday: birthday,
            });
        }

        setEditModal(false);
        setActiveWorker(null);
        setFirstName("");
        setLastName("");
        setMiddleName("");
        setBirthday("");
        setFile("");
        const { data: worker } = await axiosInstance.get(`/`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        console.log(worker);
        setWorkers(worker);
    }

    async function handleDelete() {
        await axiosInstance.delete(`/worker/${workers[activeWorker].id}`);
        const { data: worker } = await axiosInstance.get(`/`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        console.log(worker);
        setWorkers(worker);
        setDeleteModal(false);
        setActiveWorker(null);
    }

    useEffect(() => {
        setAuth(localStorage.getItem("token") ? true : false);
        console.log(auth);
        async function getWorkers() {
            if (auth) {
                const { data: workers } = await axiosInstance.get(`/`, {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                });
                console.log(workers);
                setWorkers(workers);
            } else {
                const { data: workers } = await axiosInstance.get(`/`);
                console.log(workers);
                setWorkers(workers);
            }
        }
        getWorkers();
    }, [auth]);
    function compareStrings(a, b) {
        const stringA = a.toUpperCase();
        const stringB = b.toUpperCase();

        if (stringA < stringB) {
            return -1;
        }
        if (stringA > stringB) {
            return 1;
        }
        return 0;
    }

    function compareByLastName(a, b) {
        return compareStrings(a.lastName, b.lastName);
    }

    function sortByAscendingLastName(data) {
        return data.slice().sort(compareByLastName);
    }

    function sortByDescendingLastName(data) {
        return data.slice().sort((a, b) => compareByLastName(b, a));
    }

    function compareById(a, b) {
        return a.id - b.id;
    }
    function sortByDescendingId(data) {
        return data.slice().sort((a, b) => compareById(b, a));
    }
    function sortByAscendingId(data) {
        return data.slice().sort(compareById);
    }

    function parseDate(dateString) {
        const [day, month, year] = dateString.split(".").map(Number);
        return new Date(year, month - 1, day);
    }

    function compareByBirthday(a, b) {
        const dateA = parseDate(a.birthday);
        const dateB = parseDate(b.birthday);

        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }
        return 0;
    }

    function sortByAscendingBirthday(data) {
        return data.slice().sort(compareByBirthday);
    }

    function sortByDescendingBirthday(data) {
        return data.slice().sort((a, b) => compareByBirthday(b, a));
    }

    async function handleAdd() {
        const formData = new FormData();
        formData.append("file", file);
        await axiosInstance.post(`/worker/add`, {
            lastName: lastName,
            firstName: firstName,
            middleName: middleName,
            birthday: birthday,
        });
        const { data: worker } = await axiosInstance.get(`/`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        console.log(worker);
        await axiosInstance.post(`/worker/${worker[worker.length - 1].id}/upload`, formData);
        setFile("");
        const { data: newWorkers } = await axiosInstance.get(`/`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        setWorkers(newWorkers);
        setAddModal(false);
        setActiveWorker(null);
        setFirstName("");
        setLastName("");
        setMiddleName("");
        setBirthday("");
        setFile("");
        setErrorMess("");
        console.log(newWorkers);
    }
    return (
        <div className="w-screen">
            {modal && (
                <div className="w-screen h-screen flex flex-col items-center justify-center bg-green-500">
                    <img
                        src={`http://localhost:1234/${workers[activeWorker].image}`}
                        alt=""
                        className="w-[600px] h-[600px]"
                    />
                    <p>
                        {workers[activeWorker].lastName +
                            " " +
                            workers[activeWorker].firstName +
                            " " +
                            workers[activeWorker].middleName}
                    </p>
                    <button
                        onClick={() => {
                            setModal(false);
                            setActiveWorker(null);
                        }}
                    >
                        Закрыть
                    </button>
                </div>
            )}
            {editModal && (
                <div className="w-screen h-screen flex flex-col items-center justify-center bg-green-500">
                    <form className="flex flex-col items-center">
                        <div className=" flex justify-center flex-col">
                            <label className=" cursor-pointer" htmlFor="file">
                                фотография
                            </label>
                            <input
                                onChange={(e) => setFile(e.target.files[0])}
                                className=" opacity-0 h-0 w-0"
                                id="file"
                                type="file"
                            />
                            <div>{file.name}</div>
                        </div>

                        <label htmlFor="fistName">
                            Имя
                            <input
                                className=" border-[1px] border-black rounded-md"
                                id="fistName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>
                        <label htmlFor="lastName">
                            Фамилия
                            <input
                                className=" border-[1px] border-black rounded-md"
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </label>
                        <label htmlFor="middleName">
                            Отчество
                            <input
                                className=" border-[1px] border-black rounded-md"
                                id="middleName"
                                type="text"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </label>
                        <label htmlFor="birthday">
                            Дата рождения
                            <input
                                className=" border-[1px] border-black rounded-md"
                                id="birthday"
                                type="text"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </label>
                    </form>
                    <button
                        className="border-[1px] border-black"
                        onClick={(e) => {
                            handleEdit(e);
                        }}
                    >
                        Завершить редактирование
                    </button>
                    <button
                        className="border-[1px] border-black"
                        onClick={() => {
                            setEditModal(false);
                            setActiveWorker(null);
                            setFirstName("");
                            setLastName("");
                            setMiddleName("");
                            setBirthday("");
                            setFile("");
                        }}
                    >
                        Отменить изменения
                    </button>
                </div>
            )}
            {deleteModal && (
                <div className="w-screen h-screen flex flex-col items-center justify-center bg-green-500">
                    <h3 className=" text-3xl">ФИО</h3>
                    <p>
                        {workers[activeWorker].lastName +
                            " " +
                            workers[activeWorker].firstName +
                            " " +
                            workers[activeWorker].middleName}
                    </p>
                    <h3 className=" text-3xl">Дата рождения</h3>
                    <p>{workers[activeWorker].birthday}</p>
                    <button
                        className="border-[1px] border-black"
                        onClick={() => {
                            setDeleteModal(false);
                            setActiveWorker(null);
                        }}
                    >
                        Не удалять
                    </button>
                    <button
                        className="border-[1px] border-black"
                        onClick={() => {
                            handleDelete();
                        }}
                    >
                        Точно удалить
                    </button>
                </div>
            )}
            {addModal && (
                <div className="w-screen h-screen flex flex-col items-center justify-center bg-green-500">
                    <form className="flex flex-col items-center">
                        <div className=" flex justify-center flex-col">
                            <label className=" cursor-pointer" htmlFor="file">
                                фотография
                            </label>
                            <input
                                onChange={(e) => {
                                    console.log(e.target.files[0]);
                                    if (
                                        (e.target.files[0].size <= 1000000 && e.target.files[0].type === "image/png") ||
                                        e.target.files[0].type === "image/jpeg"
                                    ) {
                                        setErrorMess("");
                                        setFile(e.target.files[0]);
                                    } else setErrorMess("файл слишком большой или не тот формат");
                                }}
                                className=" opacity-0 h-0 w-0"
                                id="file"
                                type="file"
                            />
                            <div className="text-red-500">{errorMess}</div>
                            <div>{file.name}</div>
                        </div>
                        <p className="text-red-500"> все поля обязательны для заполнения</p>
                        <label htmlFor="fistName">
                            Имя
                            <input
                                className=" border-[1px] border-black rounded-md"
                                id="fistName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>
                        <label htmlFor="lastName">
                            Фамилия
                            <input
                                className=" border-[1px] border-black rounded-md"
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </label>
                        <label htmlFor="middleName">
                            Отчество
                            <input
                                className=" border-[1px] border-black rounded-md"
                                id="middleName"
                                type="text"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </label>
                        <label htmlFor="birthday">
                            Дата рождения
                            <input
                                className=" border-[1px] border-black rounded-md"
                                id="birthday"
                                type="text"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </label>
                    </form>
                    {firstName != "" && lastName != "" && middleName != "" && birthday != "" && file != "" && (
                        <button
                            className="border-[1px] border-black"
                            onClick={(e) => {
                                handleAdd(e);
                            }}
                        >
                            Добавить Работника
                        </button>
                    )}

                    <button
                        className="border-[1px] border-black"
                        onClick={() => {
                            setAddModal(false);
                            setFirstName("");
                            setLastName("");
                            setMiddleName("");
                            setBirthday("");
                            setFile("");
                            setErrorMess("");
                        }}
                    >
                        Отменить изменения
                    </button>
                </div>
            )}
            {auth ? (
                <>
                    <div>
                        <h2 className="text-3xl ">Админ панель</h2>
                        <span
                            className="cursor-pointer border-[1px]"
                            onClick={() => {
                                localStorage.clear();
                                setAuth(false);
                            }}
                        >
                            Выйти
                        </span>
                        <span
                            onClick={() => {
                                setAddModal(true);
                            }}
                            className="cursor-pointer border-[1px]"
                        >
                            Добавить
                        </span>
                        <table className="w-screen ">
                            <tr>
                                <th
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (numberSort) {
                                            setWorkers(sortByAscendingId(workers));
                                            setNumberSort(false);
                                        } else {
                                            setWorkers(sortByDescendingId(workers));
                                            setNumberSort(true);
                                        }
                                    }}
                                >
                                    Номер
                                </th>
                                <th>Дата добавления</th>
                                <th
                                    className=" cursor-pointer"
                                    onClick={() => {
                                        if (lastNameSort) {
                                            setWorkers(sortByAscendingLastName(workers));
                                            setLastNameSort(false);
                                        } else {
                                            setWorkers(sortByDescendingLastName(workers));
                                            setLastNameSort(true);
                                        }
                                    }}
                                >
                                    ФИО
                                </th>
                                <th
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (dateSort) {
                                            setWorkers(sortByAscendingBirthday(workers));
                                            setDateSort(false);
                                        } else {
                                            setWorkers(sortByDescendingBirthday(workers));
                                            setDateSort(true);
                                        }
                                    }}
                                >
                                    Дата рождения
                                </th>
                                <th>Путь к изображению</th>
                                <th>Кнопки действия</th>
                            </tr>
                            {workers.map((e, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{e.id}</td>
                                        <td>{e.dateOfAdd}</td>
                                        <td className="text-center">
                                            {e.lastName + " " + e.firstName + " " + e.middleName + " "}
                                        </td>
                                        <td className="text-center">{e.birthday}</td>
                                        <td>{e.image}</td>
                                        <td>
                                            <button
                                                className="text-green-500"
                                                onClick={() => {
                                                    setFirstName(e.firstName);
                                                    setLastName(e.lastName);
                                                    setMiddleName(e.middleName);
                                                    setBirthday(e.birthday);
                                                    setActiveWorker(i);
                                                    setEditModal(true);
                                                }}
                                            >
                                                Редактировать
                                            </button>{" "}
                                            /{" "}
                                            <button
                                                onClick={() => {
                                                    setActiveWorker(i);
                                                    setDeleteModal(true);
                                                }}
                                                className="text-red-500"
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <h1 className=" text-5xl">Авторизация</h1>
                        <form className="">
                            <label htmlFor="login">
                                Логин
                                <input
                                    className=" border-[1px] border-black rounded-md"
                                    id="login"
                                    type="text"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                />
                            </label>
                            <label htmlFor="password">
                                Пароль
                                <input
                                    className=" border-[1px] border-black rounded-md"
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <button onClick={handleAuth}>Авторизоваться</button>
                            <div className="text-red-500">{errorMess}</div>
                        </form>
                    </div>
                    <div>
                        <h2 className="text-3xl">Главная страница</h2>
                        <table border={10} className="w-screen">
                            <tr>
                                <th>Номер</th>
                                <th>Дата добавления</th>
                                <th>ФИО</th>
                                <th>Изображение</th>
                            </tr>
                            {workers.map((e, i) => {
                                return (
                                    <tr key={i}>
                                        <td className="text-center">{e.id}</td>
                                        <td className="text-center">{e.dateOfAdd}</td>
                                        <td className="text-center">
                                            {e.lastName + " " + e.firstName + " " + e.middleName + " "}
                                        </td>
                                        <td className="flex justify-center">
                                            <img
                                                className="relative z-10 w-[200px]"
                                                onClick={() => {
                                                    setActiveWorker(i);
                                                    setModal(true);
                                                }}
                                                src={`http://localhost:1234/${e.image}`}
                                                alt=""
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                </>
            )}
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
