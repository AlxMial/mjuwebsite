import React,{useState,useEffect} from "react";
import Switch from "components/Toggles/Switch";
import { useParams, useHistory } from "react-router-dom";
import FilesService from '../../services/files'
import { useFormik  } from "formik";
import * as Yup from "yup";
import Select, { NonceProvider } from 'react-select'
import axios from "axios";
import { useToasts } from 'react-toast-notifications';
import ValidateService from '../../services/validateValue'
import urlPath from '../../services/urlServer'
// components

export default function Members() {

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const [value, setValue] = useState(false);
  const [postImage, setPostImage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [valueConfirm, setValueConfirm] = useState("");
  const [inputPhoneNumber, setinputPhoneNumber] = useState();
  const [enableControl,setIsEnableControl] = useState(true);
  const [listMembers, setListMembers] = useState([]);
  const [isNew,setIsNew] = useState(false);
  const { addToast } = useToasts();
  let { id } = useParams();
  const [optionsLearning, setOptionsLearning] = useState([])

  const handleFileUpload = async (e) => {
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    setPostImage(base64);
  }
  const options = [
    { value: '1', label: 'นาย' },
    { value: '2', label: 'นาง' },
    { value: '3', label: 'นางสาว' }
  ];

  const optionsRole = [
    { value: '1', label: 'ผู้ดูแลระบบ'},
    { value: '2', label: 'ผู้เยี่ยมชม' },
    { value: '3', label: 'วิทยากร' },
    { value: '4', label: 'เกษตรกร' }
  ];

  const defaultValue = (options, value) => {
    if(value.toString() === "" && options[0] !== undefined)
    { 
        value = options[0].value;
    }
    return options ? options.find(option => option.value === value.toString()) : "";
  };

  /*จำนวนนาทีสำหรับหลักสูตร*/
  const onHandleTelephoneChange = (e) => {
    if(ValidateService.onHandleNumberChange(e.target.value) !== "" || e.target.value === "" )
    {  
      setinputPhoneNumber(e.target.value)
      formik.values.phoneNumber = e.target.value;
    }
  };

  /*ตรวจสอบข้อมูล รหัสผ่านตรงกัน*/
  const validateConfirm = (e) => {
    if(e !==  formik.values.password)
      setConfirmPassword(true)
    else setConfirmPassword(false);
  }

  const formik = useFormik({
     initialValues : {
      accountCode:'',
      title:'',
      firstName:'',
      lastName:'',
      email:'',
      phoneNumber:'',
      address:'',
      description:'',
      role:'',
      learningPathId:'',
      password:'',
      profilePicture:'',
      isActivated:false,
      IsDeleted:false
    },
    validationSchema: Yup.object({
      accountCode:Yup.string().required('* กรุณากรอก รหัสบัญชีผู้ใช้'),
      firstName:Yup.string().required('* กรุณากรอก ชื่อ'),
      lastName:Yup.string().required('* กรุณากรอก นามสกุล'),
      email:Yup.string().email('* รูปแบบอีเมลไม่ถูกต้อง').required('* กรุณากรอก อีเมล'),
      phoneNumber:Yup.string().matches(phoneRegExp, '* รูปแบบเบอร์โทรศัพท์ ไม่ถูกต้อง'),
      password:Yup.string().required('* กรุณากรอก รหัสผ่าน'),
    }),

    onSubmit: values => {
      formik.values.title = (formik.values.title === "") ? "1" : formik.values.title ;
      formik.values.role = (formik.values.role === "") ? "1" : formik.values.role ;
      formik.values.learningPathId = (formik.values.learningPathId === "") ? "1" : formik.values.learningPathId;
      if(!isNew)
        if(values.id === undefined)
          values.id = listMembers.filter(x => x.accountCode === formik.values.accountCode )[0].id;
      axios.get(urlPath+`/members/getAccountCode/${values.accountCode}`,{
        headers: {accessToken : localStorage.getItem("accessToken")}
      }).then((response) => {
        if(response.data === null || response.data.id === values.id) {
          insertAccount(values);
        } else {
          addToast('ไม่สามารถบันทึกข้อมูลได้ เนื่องจากรหัสบัญชีผู้ใช้ซ้ำ กรุณากรอกรหัสบัญชีผู้ใช้ใหม่', { appearance: 'warning', autoDismiss: true });
        }

      });
    },
  });

  const insertAccount = (values) => {
    axios.get(urlPath+`/members/getemail/${values.email}`).then((response) => {
      if(response.data === null || (response.data && response.data.id === values.id)) {
        if(!confirmPassword)
        {
          values.isActivated = value;
          values.profilePicture = postImage;
          if(isNew){
              axios.post(urlPath+"/members",values).then((response)=>{
              if(response.data.error) 
              {
                addToast(response.data.error, { appearance: 'error', autoDismiss: true });
              } else {
                addToast('บันทึกข้อมูลสำเร็จ', { appearance: 'success', autoDismiss: true });
                setIsEnableControl(true);
                setIsNew(false);
                axios.get(urlPath+"/members",{
                  headers: {accessToken : localStorage.getItem("accessToken")}
                }).then((response) => {
                  if(response){
                      setListMembers(response.data.listMembers);
                    }
                  });
              }
            });
          } else {
              if(values.id === undefined)
                values.id = listMembers.filter(x => x.accountCode === formik.values.accountCode )[0].id;
              axios.put(urlPath+"/members",values,{
                headers: {accessToken : localStorage.getItem("accessToken")}
              }).then((response) => {
              if(response.data.error) 
              {
                addToast(response.data.error, { appearance: 'error', autoDismiss: true });
              } else {
                addToast('บันทึกข้อมูลสำเร็จ', { appearance: 'success', autoDismiss: true });
                setIsEnableControl(true);
              }
            });
          }
        }
      }
      else {
        addToast('ไม่สามารถบันทึกข้อมูลได้ เนื่องจากอีเมลที่ใช้งานมีการลงทะเบียนเรียบร้อยแล้ว', { appearance: 'warning', autoDismiss: true });
      }
    });
  }

  async function fetchData() {
    let response = await axios(
      urlPath+`/members/byId/${id}`,{
        headers: {accessToken : localStorage.getItem("accessToken")}
      }
    );
    let user = await response.data;
    if(user !== null) {
      const fields = ['title', 'firstName', 'lastName', 'accountCode', 'email','phoneNumber','address','description','role','learningPathId','profilePicture','isActivated','IsDeleted','password','id'];
      fields.forEach(field => formik.setFieldValue(field, response.data[field], false));
      if(response.data.profilePicture !== null)
        setPostImage(FilesService.buffer64(response.data.profilePicture));
      setValue(response.data.isActivated);
      setValueConfirm(response.data.password)
      setListMembers(user);
      setIsNew(false);
    } else {
      setIsNew(true);
      setIsEnableControl(false);
    }
  }

  async function fetchLearning() {
    const response = await axios(urlPath+"/learning");
    const body = await response.data.listLearning;
    var JsonLearning = [];
    body.forEach(field => JsonLearning.push({value: field.id.toString(),label: field.LearningPathNameTH }))
    setOptionsLearning(JsonLearning)
  }

  

  useEffect(()=>{
      fetchData();
      fetchLearning();
  },[]);

  const EnableControl = (bool) => {
    setIsEnableControl(bool);
    if(bool)
      formik.setErrors({})
  }


  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full px-4 ">
        <>
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-2xl bg-blueGray-100 border-0">
            <form onSubmit={formik.handleSubmit}> 
            <div className="rounded-t-2xl bg-white mb-0 px-4 py-4">
              <div className="text-center flex justify-between ">
                <div>
                  <h3 className="text-blueGray-700 text-lg font-bold mt-2">จัดการบัญชีผู้ใช้</h3>
                </div>
                <div>
                  {(enableControl && !isNew) ? <button
                    className="bg-green-mju text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={ () => {EnableControl(false)}}
                  >
                  <i className="fas fa-pencil-alt"></i>&nbsp;แก้ไข
                  </button> :
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
                  <div className="w-full lg:w-2/12 px-4">
                    <div className="relative w-full mb-3">
                      <div className="image-upload">
                        <label htmlFor="file-input" className="cursor-pointer">
                          <img
                            alt="..."
                            className="w-full rounded-full align-middle border-none shadow-lg"
                            src={  ((postImage) ? postImage  :  require("assets/img/noimg.png").default) }
                          />
                        </label>
                        <input id="file-input" type="file" accept="image/jpg, image/jpeg, image/png" onChange={(e) => handleFileUpload(e)}  disabled={enableControl} />
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-10/12">
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative lg:w-6/12  mb-3">
                          <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                            รหัสบัญชีผู้ใช้
                          </label>
                          <input
                            type="text"
                            className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            autoComplete="off"
                            id="accountCode"
                            name="accountCode"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.accountCode}
                            disabled={enableControl}
                          />
                          {formik.touched.accountCode && formik.errors.accountCode ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.accountCode}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="float-right">
                          <div className="relative w-full mb-3 text-center flex justify-between">
                            <span className="text-sm font-bold text-center flex justify-between"><span className="mt-2">เปิดใช้งาน</span> &nbsp; 
                            <Switch 
                              isOn={value}
                              id="isActivated"
                              name="isActivated"
                              onColor="#0EA6E9"
                              float="right"
                              handleToggle={() => {setValue(!value)}}
                              disble={enableControl}
                            />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-3-1/12 px-4 py-1">
                        <div className="relative w-full mb-3">
                          <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                            คำนำหน้า
                          </label>
                            <Select
                              id="title"
                              name="title"
                              onChange={value => {formik.setFieldValue('title',value.value)}}
                              className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
                              options={options}
                              value={defaultValue(options, formik.values.title)}
                              isDisabled={enableControl}
                              />
                        </div> 
                      </div>
                      <div className="w-full lg:w-3-2/12 px-4 py-1">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
                          >
                            ชื่อ
                          </label>
                          <input
                            type="text"
                            className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            id="firstName"
                            name="firstName"
                            autoComplete="firstName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.firstName}
                            disabled={enableControl}
                          />
                          {formik.touched.firstName && formik.errors.firstName ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.firstName}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="w-full lg:w-3-2/12 px-4 py-1">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
                          >
                            นามสกุล
                          </label>
                          <input
                            type="text"
                            className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            id="lastName"
                            name="lastName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.lastName}
                            disabled={enableControl}
                            autoComplete="lastName"
                          />
                          {formik.touched.lastName && formik.errors.lastName ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.lastName}</div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <hr className="mt-6 border-b-1 border-blueGray-300" /> */}

                {/* <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Contact Information
                </h6> */}
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        อีเมล
                      </label>
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        disabled={enableControl}
                        autoComplete="new-password"
                      />
                      {formik.touched.email && formik.errors.email ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.email}</div>
                          ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
                      >
                        เบอร์โทร
                      </label>
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="phoneNumber"
                        name="phoneNumber"
                        maxLength={10}
                        onChange={(event) => {
                          onHandleTelephoneChange(event);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.phoneNumber}
                        disabled={enableControl}
                        autoComplete="new-password"
                      />
                       {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.phoneNumber}</div>
                          ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        บทบาท
                      </label>
                      <Select  
                        id="role"
                        name="role"
                        onChange={value => {  formik.setFieldValue('role',value.value)}}
                        //value={formik.values.title}
                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm-select shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
                        options={optionsRole} 
                        value={defaultValue(optionsRole, formik.values.role)}
                        isDisabled={enableControl}/>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        เส้นทางการเรียนรู้ที่สนใจ
                      </label>
                      <Select
                        id="learningPathId"
                        name="learningPathId"
                        onChange={value => {  formik.setFieldValue('learningPathId',value.value)}}
                        //value={formik.values.title}
                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm-select shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
                        options={optionsLearning} 
                        value={defaultValue(optionsLearning, formik.values.learningPathId)}
                        isDisabled={enableControl}/>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        รหัสผ่าน
                      </label>
                      <input
                        type="password"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="password"
                        name="password"
                        onChange={(e) => {
                          if(e.target.value !== valueConfirm ) 
                          {
                            setConfirmPassword(e.target.value);
                          }
                          else if (e.target.value === "" && valueConfirm === "")
                          {
                            setConfirmPassword(null);
                          }
                          formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        disabled={enableControl}
                      />
                      {formik.touched.password && formik.errors.password ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.password}</div>
                          ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        ยืนยันรหัสผ่าน
                      </label>
                      <input
                        type="password"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={e=>{ validateConfirm(e.target.value); setValueConfirm(e.target.value); }}
                        disabled={enableControl}
                        value={valueConfirm}
                      />
                      {confirmPassword ? (
                              <div className="text-sm py-2 px-2 text-red-500">* รหัสผ่านไม่ตรงกัน</div>
                          ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        ที่อยู่
                      </label>
                      <textarea
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows="4"
                        id="address"
                        name="address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                        disabled={enableControl}
                        autoComplete="new-password"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 py-1">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                        รายละเอียด
                      </label>
                      <textarea
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows="4"
                        id="description"
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        disabled={enableControl}
                        autoComplete="new-password"
                      ></textarea>
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
