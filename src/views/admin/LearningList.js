import React,{ useEffect,useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import ReactPaginate from 'react-paginate';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { useToasts } from 'react-toast-notifications';
import urlPath from 'services/urlServer';

Modal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding:'0%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'auto',
    overflowX: 'auto',
    backgroundColor:"#F1F5F9"
  },overlay: {zIndex: 100, backgroundColor: 'rgba(70, 70, 70, 0.5)',}
};

export default function LearningList() {

    const [modalIsOpen, setIsOpen] = useState(false);  
    const [listLearning, setListLearning] = useState([]);
    const [deleteNumber , setDeleteNumber] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [listSearch, setListSerch] = useState([]);
    const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const { addToast } = useToasts();
    function openModal(type) {
        setIsOpen(true);
    }

    function afterOpenModal(type) {
        // references are now sync'd and can be accessed.   
    }

    function closeModal() {
        setIsOpen(false);
    }

    
    function openModalSubject() {
        setIsOpenSubject(true);
    }
    
    function closeModalSubject() {
        setIsOpenSubject(false);
    }
    

    const handleChange = (e) => {
        const { name, checked } = e.target;
        if (name === "allSelect") {
            let tempLearning = listLearning.map((Learning) => {
            return { ...Learning, IsDeleted: checked };
            });
            setListLearning(tempLearning);
            setDeleteNumber(tempLearning.filter(x => x.IsDeleted === true).length);
            } 
        else {
            let tempLearning = listLearning.map((Learning) =>
            Learning.id.toString() === name ? {
                    ...Learning, IsDeleted: checked
                } : Learning
            );
            setListLearning(tempLearning);
            setDeleteNumber(tempLearning.filter(x => x.IsDeleted === true).length);
        }
    };

    const deleteLearning = async (e) => {

        const response = await  axios.get(urlPath+`/learning/getCourses/${e}`);
        const resMember = await  axios.get(urlPath+`/learning/getMembers/${e}`);
        if(response.data === null && resMember === null){
            axios
            .delete(urlPath+`/learning/${e}`)
            .then(() => {
              setListLearning(
                listLearning.filter((val) => {
                  return val.id !== e;
                })
              );
              closeModal();
            });
        }else{
            addToast('ไม่สามารถลบข้อมูลได้ เนื่องจากรหัสเส้นทางการเรียนรู้ ถูกนำไปใช้งานที่หน้าจอจัดการหลักสูตรหรือหน้าจอจัดการบัญชีผู้ใช้', { appearance: 'warning', autoDismiss: true });
            closeModal();
        }
    }

    const deleteByList = async () => {
        if(deleteNumber > 0)
        {
            var ArrayDeleted = [];
            for (const field of listLearning) {
                const response = await  axios.get(urlPath+`/learning/getCourses/${field.id}`);
                const resMember = await  axios.get(urlPath+`/learning/getMembers/${field.id}`);
                if(field.IsDeleted && response.data === null && resMember.data === null) {
                    ArrayDeleted.push(field.id)
                }else  { field.IsDeleted = false}
            }
          
            axios
            .delete(urlPath+`/learning/multidelete/${ArrayDeleted}`,{
              headers: {accessToken : localStorage.getItem("accessToken")}
            })
            .then(() => {
                setDeleteNumber(0);
                closeModalSubject();
                setListLearning(
                    listLearning.filter((val) => {
                      return val.IsDeleted !== true;
                    })
                  );
            });
        }
    }

    const pageCount = Math.ceil(listLearning.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const displayUsers = listLearning
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((value) => {
      return (
        <>
            <tr key={value.id}>
                <th className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap">
                    <input
                        type="checkbox"
                        name={value.id}
                        checked={value?.IsDeleted || false}
                        onChange={handleChange}
                        className="form-checkbox rounded text-green-200-mju w-5 h-5 ease-linear transition-all duration-150"
                    />
                </th>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap cursor-pointer">
                    <Link to={`/admin/learning/${value.id}`}>{ value.LearningPathNameTH }</Link>
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap  cursor-pointer">
                    <Link to={`/admin/learning/${value.id}`} >{value.LearningPathNameENG}</Link>
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap cursor-pointer">
                    {value.CoursesCount}
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-3">
                    <label className="text-red-500 cursor-pointer" onClick={() => {openModal("delete")}}>  <i className="fas fa-trash"></i> ลบ</label>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                        >
                        <div className="flex flex-wrap">
                            <div className="w-full ">
                                <>
                                <div className="relative flex flex-col min-w-0 break-words w-full  rounded-lg  border-0">
                                <div className="rounded-t bg-white mb-0 px-4 py-4">
                                    <div className="text-center flex justify-between">
                                    <div className="">
                                        <h6 className="text-blueGray-700 text-base  font-bold mt-2"><i className="fas fa-exclamation-triangle"></i>&nbsp; แจ้งเตือน</h6>
                                    </div>
                                    <div className="">
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className={"flex-auto "}>
                                    <div className="w-full mt-2">
                                        <div className="relative w-full mb-3">
                                            <div className=" align-middle  mb-2">
                                                <div  className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                                    <label className="cursor-pointer">คุณต้องการทำการลบข้อมูลใช่หรือไม่</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative w-full mb-3">
                                            <div className=" flex justify-between align-middle ">
                                                <div>
                                                </div>
                                                <div  className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                                    <label className="text-red-500 cursor-pointer" onClick={() => {openModal(deleteLearning(value.id))}}> <i className="fas fa-trash"></i> ลบ</label>
                                                    <label className="font-bold">&nbsp;|&nbsp;</label>
                                                    <label className="cursor-pointer" onClick={closeModal}> <i className="fas fa-times"></i> ยกเลิก</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>
                            </div>
                        </div>
                    </Modal>
                </td>
            </tr>
            </>
        );
    });

    const InputSearch = (e) => {
        if(e === "") {
            setListLearning(listSearch);
        } else {
            setListLearning(listLearning.filter(x => x.LearningPathNameTH.includes(e) 
            || x.LearningPathNameENG.includes(e) ));
        }
    }

    useEffect( ()=>  {
        axios.get(urlPath+"/learning").then( async (response)   =>   {
             for(const learning of response.data.listLearning ){
                await axios.get(urlPath+`/courses/byLearningId/${learning.id}`).then((res) =>   {
                    learning.CoursesCount = res.data.length;
                });
            }
            setListLearning(response.data.listLearning);
            setListSerch(response.data.listLearning);
        });

      },[]);

  return (
    <>
      <div className="flex flex-wrap mt-4 md:min-h-full ">
        <div className="w-full mb-12 px-4">
            <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-2xl bg-white"}>
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                        {/* Brand */}
                            <h3 className={"font-semibold text-lg text-blueGray-700"}>
                                จัดการเส้นทางการเรียนรู้
                            </h3>
                            <h3 className={"font-semibold px-2 text-lg text-blueGray-700"}>
                                |
                            </h3>
                            <h3 className={"font-semibold text-sm text-blueGray-700"}>
                                {listLearning.length} รายการ
                            </h3>
                            <h3 className={"font-semibold text-sm text-blueGray-700 leading-2"}>
                            &nbsp; <i className="fas fa-trash text-red-500 cursor-pointer" onClick={()=>{openModalSubject()}}></i> &nbsp;
                                <span>ลบ {deleteNumber} รายการที่เลือก</span>
                                <ConfirmDialog  showModal={modalIsOpenSubject} message={"จัดการเส้นทางการเรียนรู้"} hideModal={()=>{closeModalSubject()}} confirmModal={() => {deleteByList()}}/>
                            </h3>
                        {/* Form */}
                        <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
                            <div className="relative flex w-full flex-wrap items-stretch">
                                <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center pl-3 py-2">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-12"
                                    onChange={(e)=>{InputSearch(e.target.value)}}
                                />
                            </div>
                        </form>
                        {/* User */}
                        <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
                            <Link to="/admin/learning" ><button
                            className="bg-white text-black active:bg-lightBlue-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                            type="button"
                            >
                            <i className="fas fa-plus text-green-mju"></i> เพิ่ม
                            </button></Link>
                        </ul>
                    </div>
                    
                </div>
                <div className="block w-full overflow-x-auto">
                {/* Projects table */}
                <table className="w-full bg-transparent border-collapse">
                    <thead>
                    <tr>
                        <th
                        className={"text-center px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"}
                        >
                        <input
                            type="checkbox"
                            name="allSelect"
                            checked={!listLearning.some((Learning) => Learning?.IsDeleted !== true)}
                            onChange={handleChange}
                            className="form-checkbox rounded text-green-200-mju w-5 h-5 ease-linear transition-all duration-150"
                        />
                        </th>
                        <th
                        className={
                            "px-2 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        >
                        ชื่อเส้นทางการเรียนรู้ (ไทย)
                        </th>
                        <th
                        className={
                            "px-2  border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        >
                        ชื่อเส้นทางการเรียนรู้ (ENG)
                        </th>
                        <th
                        className={
                            "px-2 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        >
                        จำนวนหลักสูตร
                        </th>
                        <th
                        className={
                            "px-2 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        >
                        สถานะ
                        </th>
                        <th
                        className={
                            "px-2 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        ></th>
                    </tr>
                    </thead>
                    <tbody>
                        {displayUsers}  
                    </tbody>
                </table>
                </div>
                <div className="py-4">
                <ReactPaginate
                    previousLabel={" < "}
                    nextLabel={" > "}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisabled"}
                    activeClassName={"paginationActive"}
                />
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
