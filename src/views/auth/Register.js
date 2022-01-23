import React,{useState,useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useFormik  } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useToasts } from 'react-toast-notifications';
import Select from 'react-select'
import urlPath from 'services/urlServer';

export default function Register() {

  const [confirmPassword, setConfirmPassword] = useState(false);
  const [valueConfirm, setValueConfirm] = useState("");
  const [isTerm,setIsTerm] = useState("");
  const { addToast } = useToasts();
  let history = useHistory();
  const [optionsLearning, setOptionsLearning] = useState([])
  const optionsRole = [
    { value: '3', label: 'วิทยากร' },
    { value: '4', label: 'เกษตรกร' }
  ];


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
     firstName:Yup.string().required('* กรุณากรอก ชื่อ'),
     lastName:Yup.string().required('* กรุณากรอก นามสกุล'),
     email:Yup.string().email('* รูปแบบอีเมลไม่ถูกต้อง').required('* กรุณากรอก อีเมล'),
     password:Yup.string().required('* กรุณากรอก รหัสผ่าน'),
   }),

   onSubmit: values => {
      formik.values.role = (formik.values.role === "") ? "3" : formik.values.role ;
      formik.values.learningPathId = (formik.values.learningPathId === "") ? "1" : formik.values.learningPathId ;
      if(!confirmPassword && isTerm)
      {
        values.isActivated = true;
        values.IsDeleted = false;
        axios.get(urlPath+`/members/getemail/${values.email}`).then((response) => {
          console.log(response)
          if(response.data === null) {
              axios.post(urlPath+"/members",values).then((response)=>{
                if(response.data.error) 
                {
                  addToast(response.data.error, { appearance: 'error', autoDismiss: true });
                } else {
                  addToast('ลงทะเบียนสำเร็จ', { appearance: 'success', autoDismiss: true });
                  history.push("/auth/login");
                }
              });
          }
          else {
            addToast('ไม่สามารถบันทึกข้อมูลได้ เนื่องจากอีเมลที่ใช้งานมีการลงทะเบียนเรียบร้อยแล้ว', { appearance: 'warning', autoDismiss: true });
          }
        });
      }
   },
  });

  /*ตรวจสอบข้อมูล รหัสผ่านตรงกัน*/
  const validateConfirm = (e) => {
    if(e !==  formik.values.password)
      setConfirmPassword(true)
    else setConfirmPassword(false);
  }

  async function fetchLearning() {
    const response = await axios(urlPath+"/learning");
    const body = await response.data.listLearning;
    var JsonLearning = [];
    body.forEach(field => JsonLearning.push({value: field.id.toString(),label: field.LearningPathNameTH }))
    setOptionsLearning(JsonLearning)
  }

  const defaultValue = (options, value) => {
    if(value.toString() === "" && options[0] !== undefined)
    { 
        value = options[0].value;
    }
    return options ? options.find(option => option.value === value.toString()) : "";
  };
  
  useEffect( ()=>  {
    fetchLearning();
  },[]);


  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-12/12 px-4">
          <div className="flex flex-wrap relative min-w-0 break-words w-full shadow-lg rounded-lg border-0">
            <div className="w-1/2 bg-darkgreen-mju  text-white rounded-t-l-lg rounded-b-l-lg  pt-12 pl-4 pr-4 pb-2">
                <h2 className="text-2xl text-bold THSarabunBold">INFORMATION</h2>
                <br/>
                <div className="text-indent">
                  <span className="text-sm">
                    Organic farming is an agricultural system that uses fertilizers of organic origin such as compost manure, green manure, and bone meal and places emphasis on techniques such as crop rotation and companion planting. It originated early in the 20th century in reaction to rapidly changing farming practices. Certified organic agriculture accounts for 70 million hectares globally, with over half of that total in Australia. Organic farming continues to be developed by various organizations today. Biological pest control, mixed cropping and the fostering of insect predators are encouraged. Organic standards are designed to allow the use of naturally-occurring substances while prohibiting or strictly limiting synthetic substances.
                  </span>
                </div>
                <br/>
                <br/>
                <div className="text-indent">
                  <span  className="text-sm">
                    Since 1990, the market for organic food and other products has grown rapidly, reaching $63 billion worldwide in 2012. This demand has driven a similar increase in organically-managed farmland that grew from 2001 to 2011 at a compounding rate of 8.9% per annum.
                  </span>
                </div>
                <br/>
                <br/>
                <div className="text-indent">
                  <span  className="text-sm">
                    As of 2019, approximately 72,300,000 hectares (179,000,000 acres) worldwide were farmed organically, representing approximately 1.5 percent of total world farmland.
                  </span>
                </div>
            </div>
            <div className="w-1/2 bg-white  text-black rounded-t-r-lg rounded-b-r-lg pt-12 pl-4 pr-4 pb-2">
              <form onSubmit={formik.handleSubmit}>
                <h2 className="text-2xl text-bold text-green-mju THSarabunBold">REGISTER FORM</h2>
                <div className="flex flex-wrap relative mt-5">
                  <div className="w-full lg:w-6/12">
                      <div className="relative w-full mb-3 px-2">
                        <label
                          className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="First Name"
                          id="firstName"
                          name="firstName"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.firstName}
                          autoComplete="new-password"
                        />
                         {formik.touched.firstName && formik.errors.firstName ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.firstName}</div>
                          ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12">
                      <div className="relative w-full mb-3 px-2">
                        <label
                          className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
                          
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Last Name"
                          id="lastName"
                          name="lastName"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.lastName}
                          autoComplete="new-password"
                        />
                         {formik.touched.lastName && formik.errors.lastName ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.lastName}</div>
                          ) : null}
                      </div>
                    </div>
                </div>
                <div className="relative w-full px-2 mt-2">
                    <label
                      className="block text-blueGray-600 text-sm font-bold mb-2"
                    >
                      Role
                    </label>
                    {/* <select 
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-xs shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="role"
                        name="role"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.role}
                        autoComplete="new-password"
                    >
                      <option value={3}>วิทยากร</option>
                      <option value={4}>เกษตรกร</option>
                    </select> */}

                      <Select  
                        id="role"
                        name="role"
                        onChange={value => {  formik.setFieldValue('role',value.value)}}
                        //value={formik.values.title}
                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm-select shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
                        options={optionsRole} 
                        value={defaultValue(optionsRole, formik.values.role)}
                        />      
                </div>
                <div className="relative w-full px-2 mt-4">
                  <label
                    className="block text-blueGray-600 text-sm font-bold mb-2"
                    
                  >
                    Your Email
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-xs shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Your Email"
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    autoComplete="new-password"
                  />
                   {formik.touched.email && formik.errors.email ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.email}</div>
                          ) : null}
                </div>
                <div className="relative w-full px-2 mt-4">
                  <label
                    className="block text-blueGray-600 text-sm font-bold mb-2"
                    
                  >
                    Interesting Learning Path
                  </label>
                  {/* <select className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-xs shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    id="learningPathId"
                    name="learningPathId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.learningPathId}
                    autoComplete="new-password">
                    <option value={1}>Rice</option>
                    <option value={2}>Mangosteen</option>
                  </select> */}

                    <Select
                      id="learningPathId"
                      name="learningPathId"
                      onChange={value => {  formik.setFieldValue('learningPathId',value.value)}}
                      //value={formik.values.title}
                      className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm-select shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
                      options={optionsLearning} 
                      value={defaultValue(optionsLearning, formik.values.learningPathId)}
                      />
                  {/* <Select  className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-xs shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" options={options} /> */}

                </div>
                <div className="flex flex-wrap relative mt-4">
                  <div className="w-full lg:w-6/12">
                    <div className="relative w-full mb-3 px-2">
                      <label
                        className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
                        
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                        id="password"
                        name="password"
                        onChange={(e) => {
                          if(e.target.value !== valueConfirm ) 
                          {
                            setConfirmPassword(e.target.value);
                          }
                          else if (e.target.value === "" && valueConfirm === "" || e.target.value === valueConfirm)
                          {
                            setConfirmPassword(null);
                          }
                          formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                       {formik.touched.password && formik.errors.password ? (
                              <div className="text-sm py-2 px-2 text-red-500">{formik.errors.password}</div>
                          ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12">
                    <div className="relative w-full mb-3 px-2">
                      <label
                        className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
                        
                      >Confirm Password
                      </label>
                      <input
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={e=>{ validateConfirm(e.target.value); setValueConfirm(e.target.value); }}
                        value={valueConfirm}
                      />
                      {confirmPassword ? (
                              <div className="text-sm py-2 px-2 text-red-500">* รหัสผ่านไม่ตรงกัน</div>
                          ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-4 px-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox  rounded text-green-200-mju ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        onClick={(e) => {setIsTerm(e.target.checked)}}
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree to the{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          Terms and Conditions
                        </a>
                      </span>
                    </label>
                  </div>
                  <div className="text-center px-2 mt-2">
                    <button
                      className="bg-darkgreen-mju text-white active:bg-darkgreenactive-mju text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      REGISTER
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>


          
        </div>
      </div>
    </>
  );
}
