import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useFormik  } from "formik";
import * as Yup from "yup";
import { useToasts } from 'react-toast-notifications';
import FilesService from 'services/files';
import urlPath from 'services/urlServer';
// components

export default  function Learning() {

  const { addToast } = useToasts();
  let { id } = useParams();
  const [enableControl,setIsEnableControl] = useState(true);
  const [isNew,setIsNew] = useState(false);
  const [listLearning, setListLearning] = useState([]);

  const formik = useFormik({
    initialValues : {
      LearningPathCode:'',
      LearningPathNameTH:'',
      LearningPathNameENG:'',
      DescriptionTH:'',
      DescriptionENG:'',
      IsDeleted:false
   },
   validationSchema: Yup.object({
    LearningPathCode:Yup.string().required('* กรุณากรอก รหัสเส้นทางการเรียนรู้'),
    LearningPathNameTH: Yup.string().required('* กรุณากรอก ชื่อเส้นทางการเรียนรู้ (ไทย)'),
    DescriptionTH: Yup.string().required('* กรุณากรอก รายละเอียดเส้นทางการเรียนรู้ (ไทย)'),
   }),
   onSubmit: values => {
    axios.get(urlPath+`/learning/byLearningCode/${values.LearningPathCode}`,{
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        accessToken : localStorage.getItem("accessToken"),
     },
    },{ }).then((response) => {
      if(response.data === null || response.data.id === values.id) {
        if(isNew){
          axios.post(urlPath+"/learning",values).then((response)=>{
          if(response.data.error) 
          {
            addToast(response.data.error, { appearance: 'error', autoDismiss: true });
          } else {
            addToast('บันทึกข้อมูลสำเร็จ', { appearance: 'success', autoDismiss: true });
            setIsEnableControl(true);
            setIsNew(false)
            axios.get(urlPath+"/learning").then((response) =>   {
              setListLearning(response.data.listLearning);
            });
          }
          });
        } else {
            if(values.id === undefined)
              values.id = listLearning.filter(x => x.LearningPathCode === formik.values.LearningPathCode )[0].id;
            axios.put(urlPath+"/learning",values).then((response) => {
            if(response.data.error) 
            {
              addToast(response.data.error, { appearance: 'error', autoDismiss: true });
            } else {
              addToast('บันทึกข้อมูลสำเร็จ', { appearance: 'success', autoDismiss: true });
              setIsEnableControl(true);
            }
          });
        }
      } else {
        addToast('ไม่สามารถบันทึกข้อมูลได้ เนื่องจากรหัสเส้นทางการเรียนรู้ซ้ำ กรุณากรอกรหัสเส้นทางการเรียนรู้ใหม่', { appearance: 'warning', autoDismiss: true });
      }
    });
   },
 });

  async function fetchData() {
    let response = await axios(
      urlPath+`/learning/byId/${id}`
    );
    let user = await response.data;
    if(user !== null) {
      for(var columns in response.data) {
        if(columns === "DescriptionTH" || columns === "DescriptionENG")
        formik.setFieldValue(columns,FilesService.buffer64UTF8(response.data[columns]), false)
        else formik.setFieldValue(columns, response.data[columns], false)
      }
      setListLearning(response.data);
      setIsNew(false);
    } else {
      setIsNew(true);
      setIsEnableControl(false);
    }
  }

  useEffect(()=>{
    fetchData();

  },[]);

  const EnableControl = (bool) => {
    setIsEnableControl(bool);
    if(bool)
      formik.setErrors({})
  }

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full px-4">
        <>
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-2xl bg-blueGray-100 border-0">
          <form onSubmit={formik.handleSubmit}>
            <div className="rounded-t-2xl bg-white mb-0 px-4 py-4">
              <div className="text-center flex justify-between ">
                <div>
                  <h3 className="text-blueGray-700 text-xl font-bold mt-2">จัดการเส้นทางการเรียนรู้</h3>
                </div>
                <div>
                {(enableControl && !isNew) ? 
                  <button
                    className="bg-green-mju text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={ () => {EnableControl(false)}}
                  >
                    <i className="fas fa-pencil-alt"></i>&nbsp;แก้ไข
                  </button> 
                  :
                  <>
                    <button
                      className={"bg-rose-mju text-white active:bg-rose-mju font-bold uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" + ((isNew ? " hidden" : " "))}
                      type="button"
                      onClick={() =>{EnableControl(true)}}
                    >
                    <i className="fas fa-pencil-alt"></i>&nbsp;ละทิ้ง
                    </button>     
                    <button
                      className="bg-blue-save-mju text-white active:bg-blueactive-mju font-bold uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" 
                      type="submit"
                      >
                    <i className="fas fa-save"></i>&nbsp;บันทึก
                    </button>
                  </>
                  }
                  </div>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="flex flex-wrap  mt-6">
                  <div className="w-full px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        รหัสเส้นทางการเรียนรู้
                      </label>
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="LearningPathCode"
                        name="LearningPathCode"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.LearningPathCode}
                        disabled={enableControl}
                      />
                      {formik.touched.LearningPathCode && formik.errors.LearningPathCode ? (
                            <div className="text-sm py-2 px-2 text-red-500">{formik.errors.LearningPathCode}</div>
                        ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        ชื่อเส้นทางการเรียนรู้ (ไทย)
                      </label>
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="LearningPathNameTH"
                        name="LearningPathNameTH"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.LearningPathNameTH}
                        disabled={enableControl}
                      />
                      {formik.touched.LearningPathNameTH && formik.errors.LearningPathNameTH ? (
                            <div className="text-sm py-2 px-2 text-red-500">{formik.errors.LearningPathNameTH}</div>
                        ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        ชื้่อเส้นทางการเรียนรู้ (ENG)
                      </label>
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"

                        id="LearningPathNameENG"
                        name="LearningPathNameENG"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.LearningPathNameENG}
                        disabled={enableControl}
                      />
                 
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        รายละเอียดเส้นทางการเรียนรู้ (ไทย)
                      </label>
                      <ReactQuill
                        theme="snow"
                        value={formik.values.DescriptionTH}
                        onChange={v =>  formik.setFieldValue('DescriptionTH', v)} 
                        placeholder={"Write something awesome..."}
                        readOnly={enableControl}
                        modules={{
                          // syntax: true,
                          toolbar: [ 
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline','strike', 'blockquote'],
                            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}], 
                            ['link', 'image','video'],['code-block']
                          ]
                        }}
                        formats={[
                          'header',
                          'bold', 'italic', 'underline', 'strike', 'blockquote',
                          'list', 'bullet', 'indent',
                          'link', 'image','video',
                          'align','code-block'
                        ]}
                      />
                      {formik.touched.DescriptionTH && formik.errors.DescriptionTH ? (
                        <div className="text-sm py-2 px-2 text-red-500">{formik.errors.DescriptionTH}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
                        
                      >
                        รายละเอียดเส้นทางการเรียนรู้ (ENG)
                      </label>
                      <ReactQuill
                        theme="snow"
                        value={formik.values.DescriptionENG}
                        onChange={v =>  formik.setFieldValue('DescriptionENG', v)} 
                        placeholder={"Write something awesome..."}
                        readOnly={enableControl}
                        modules={{
                          // syntax: true,
                          toolbar: [ 
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline','strike', 'blockquote'],
                            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}], 
                            ['link', 'image','video'], 
                            ['clean'] 
                          ]
                        }}
                        formats={[
                          'header',
                          'bold', 'italic', 'underline', 'strike', 'blockquote',
                          'list', 'bullet', 'indent',
                          'link', 'image','video',
                          'align',
                          'code-block'
                        ]}

                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
        </div>
      </div>
    </>
  );
}
