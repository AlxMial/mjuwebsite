import React from 'react'
import Modal from "react-modal";
 
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

const ConfirmDialog = ({ showModal, hideModal,afterOpenModal, confirmModal, id, type, message }) => {
    return (
        <Modal
            isOpen={showModal}
            onAfterOpen={afterOpenModal}
            onRequestClose={hideModal}
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
                                        <label className="cursor-pointer">คุณต้องการลบข้อมูล{message}ใช่หรือไม่</label>
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full mb-3">
                                <div className=" flex justify-between align-middle ">
                                    <div>
                                    </div>
                                    <div  className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                        <label className="text-red-500 cursor-pointer" onClick={() => {(confirmModal(id));}}> <i className="fas fa-trash"></i> ลบ</label>
                                        <label className="font-bold">&nbsp;|&nbsp;</label>
                                        <label className="cursor-pointer" onClick={hideModal}> <i className="fas fa-times"></i> ยกเลิก</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                </div>
            </div>
        </Modal>
    )
}
 
export default ConfirmDialog;