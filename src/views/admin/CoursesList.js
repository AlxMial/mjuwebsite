import React,{ useEffect,useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import ReactPaginate from 'react-paginate';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
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

export default function CoursesList() {

    const [modalIsOpen, setIsOpen] = useState(false);  
    const [listCourses, setListCourses] = useState([]);
    const [deleteNumber , setDeleteNumber] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [listSearch, setListSerch] = useState([]);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
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
            let tempCourses = listCourses.map((Courses) => {
            return { ...Courses, IsDeleted: checked };
            });
            setListCourses(tempCourses);
            setDeleteNumber(tempCourses.filter(x => x.IsDeleted === true).length);
            } 
        else {
            let tempCourses = listCourses.map((Courses) =>
            Courses.id.toString() === name ? {
                    ...Courses, IsDeleted: checked
            } : Courses
            );
            setListCourses(tempCourses);
            setDeleteNumber(tempCourses.filter(x => x.IsDeleted === true).length);
        }
    };

    const deleteCourses = (e) => {
        axios
          .delete(urlPath+`/courses/${e}`)
          .then(() => {
            setListCourses(
              listCourses.filter((val) => {
                return val.id !== e;
              })
            );
            closeModal();
        });
    }

    const deleteByList = () => {
        if(deleteNumber > 0)
        {
            var ArrayDeleted = [];
            listCourses.forEach(field => { if(field.IsDeleted === true) { ArrayDeleted.push(field.id)}});
            axios
            .delete(urlPath+`/courses/multidelete/${ArrayDeleted}`,{
              headers: {accessToken : localStorage.getItem("accessToken")}
            })
            .then(() => {
                setDeleteNumber(0);
                closeModalSubject();
                setListCourses(
                    listCourses.filter((val) => {
                      return val.IsDeleted !== true;
                    })
                  );
            });
        }
    }

    const pageCount = Math.ceil(listCourses.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const displayUsers = listCourses
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
                    <Link to={`/admin/courses/${value.id}`}>{ value.CurriculumCode }</Link>
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap  cursor-pointer">
                    <Link to={`/admin/courses/${value.id}`} >{ value.CurriculumNameTH }</Link>
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap cursor-pointer">
                    <Link to={`/admin/courses/${value.id}`} >{ value.CurriculumNameENG }</Link>
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap ">
                    <>{ value.SubjectsCount }</>
                </td>
                <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap ">
                    { (value.NumOfHours*60)+value.NumOfMin }
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
                                                    <label className="text-red-500 cursor-pointer" onClick={() => {openModal(deleteCourses(value.id))}}> <i className="fas fa-trash"></i> ลบ</label>
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
            setListCourses(listSearch);
        } else {
            setListCourses(listCourses.filter(x => x.CurriculumCode.includes(e) 
            || x.CurriculumNameTH.includes(e) || x.CurriculumNameENG.includes(e) 
            ));
        }
    }

    useEffect( ()=>  {
        axios.get(urlPath+"/courses").then((response) =>   {
            setListCourses(response.data.listOfCourses);
            setListSerch(response.data.listOfCourses);
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
                                จัดการหลักสูตร
                            </h3>
                            <h3 className={"font-semibold px-2 text-lg text-blueGray-700"}>
                                |
                            </h3>
                            <h3 className={"font-semibold text-sm text-blueGray-700"}>
                                {listCourses.length} รายการ
                            </h3>
                            <h3 className={"font-semibold text-sm text-blueGray-700 leading-2"}>
                            &nbsp; <i className="fas fa-trash text-red-500 cursor-pointer" onClick={()=>{openModalSubject()}}></i> &nbsp;
                                <span>ลบ {deleteNumber} รายการที่เลือก</span>
                                <ConfirmDialog  showModal={modalIsOpenSubject} message={"จัดการบัญชีผู้ใช้"} hideModal={()=>{closeModalSubject()}} confirmModal={() => {deleteByList()}}/>
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
                            <Link to="/admin/courses" ><button
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
                            checked={!listCourses.some((Courses) => Courses?.IsDeleted !== true)}
                            onChange={handleChange}
                            className="form-checkbox rounded text-green-200-mju w-5 h-5 ease-linear transition-all duration-150"
                        />
                        </th>
                        <th
                        className={
                            "px-2 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        >
                        รหัสหลักสูตร
                        </th>
                        <th
                        className={
                            "px-2  border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        >
                        ชื่อหลักสูตร (ไทย)
                        </th>
                        <th
                        className={
                            "px-2 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        >
                        ชื่อหลักสูตร (ENG)
                        </th>
                        <th
                        className={
                            "px-2 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        >
                        จำนวนหัวข้อการเรียนรู้
                        </th>
                        <th
                        className={
                            "px-2 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        }
                        >
                        เวลา (นาที)
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
