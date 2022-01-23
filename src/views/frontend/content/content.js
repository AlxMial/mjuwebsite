import React, { useState, useEffect } from 'react'
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import urlPath from 'services/urlServer';
import './content.css'
import ReactQuill from 'react-quill';
import FilesService from 'services/files'

export default function Content() {
    let { id } = useParams();
    const [subjectData, setSubjectData] = useState([]);
    const [attachData, setAttachData] = useState([]);
    const history = useHistory();

    async function fetchSubject() {
        let response = await axios(
            urlPath+`/subjects/byId/${id}`
        );
        let data = await response.data;
        if (data !== null) {
            response.data.ContentTH = FilesService.buffer64UTF8(response.data.ContentTH)
            response.data.ContentENG = FilesService.buffer64UTF8(response.data.ContentENG)

     
            axios.get(urlPath+`/attachs/bySubjectsId/${response.data.id}`,{
                headers: {accessToken : localStorage.getItem("accessToken")}
              }).then((res) => {
                if(res.data !== null) {
                    setAttachData(res.data)
                }
            });

            setSubjectData(response.data);
        }
        else { console.log('No Data') }
    }

    // const subjectDataTemp = {
    //     id: 2,
    //     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRxgWGxEtMlqQqTJi9INeFmSksx54dZoSLxg&usqp=CAU',
    //     SubjectCode: 'Subject Code 001',
    //     SubjectNameTH: "ชื่อ Object TH",
    //     SubjectNameEng: "Object Name Eng",
    //     SubjectOfHour: "40",
    //     ContentTH: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nulla ipsa doloremque est beatae eos suscipit nihil quasi consectetur dolorum ad asperiores aperiam nostrum repellendus molestiae nemo facilis esse porro autem ab, soluta perferendis labore, explicabo possimus. Aut consequuntur, assumenda vero quidem dolorum ea id eum cum ducimus delectus vel, voluptatum, dicta magnam rem inventore quaerat incidunt quisquam in. Dolorem quo et nemo maxime amet dignissimos dolorum quia architecto corrupti, autem laboriosam animi corporis adipisci velit perferendis quis? Tempore similique delectus molestias, sint repellendus a aliquam pariatur quia distinctio repellat eius dolores consequatur nihil fugiat sed illum quis adipisci. Saepe, animi. Quae, animi autem. Excepturi sunt quo, quisquam libero nesciunt quibusdam modi iure porro cupiditate! Laboriosam nostrum, recusandae hic odio sapiente fugiat asperiores consequatur nesciunt omnis aspernatur quasi, repellendus ipsum facere? Earum culpa incidunt eius ex vero sequi, hic porro eos necessitatibus provident maxime cumque esse odio autem sint delectus molestiae et atque, numquam saepe error quae dolores dicta modi. Qui repellendus magni consequatur, laborum, provident deserunt alias eligendi reiciendis exercitationem esse labore aliquam voluptate temporibus ea voluptatum molestiae dolorem neque dicta voluptatem perspiciatis nam soluta rerum. Fugiat consequuntur sequi perspiciatis doloremque necessitatibus asperiores nulla, ipsa nostrum neque voluptate provident delectus minus autem in aspernatur eos! Commodi cumque porro aperiam incidunt blanditiis. Iusto ipsam eligendi sint nulla beatae, sed corrupti nobis accusamus quos voluptate optio iure itaque ut vitae aperiam iste debitis. Obcaecati natus hic accusamus molestiae, ullam totam debitis culpa inventore laboriosam illum illo error eaque sed corrupti adipisci tempora, recusandae expedita repellendus? Voluptate dolorum, voluptatem nobis praesentium eius aperiam sapiente blanditiis aliquam ipsum facere voluptates debitis quod exercitationem illum sit minima natus! Enim voluptates, rem, hic eveniet deleniti, quidem inventore sequi recusandae iure consequuntur assumenda necessitatibus saepe vero. Aspernatur vitae vero, repudiandae dignissimos sapiente odit quod quibusdam enim corporis quia, inventore consequatur ducimus dolores beatae similique recusandae labore quaerat, laborum maiores. Illo sapiente repellendus esse facere. Magni ullam consectetur enim minus perspiciatis, sed fugiat blanditiis unde tempore, facilis saepe impedit rerum labore? Ab, nostrum mollitia nulla dolor fuga saepe, ratione sunt alias commodi, ad ipsam nesciunt in odit minus consequatur id vero totam rem deleniti distinctio eaque quos? Vero illum sunt nesciunt hic. Quis, tempore facilis error quaerat autem reiciendis ratione quibusdam temporibus quos cumque officiis nulla nostrum itaque officia vel beatae amet, saepe, explicabo exercitationem laboriosam consectetur. Sapiente temporibus, fugit pariatur cupiditate nihil veniam. Voluptatem nobis, cum unde molestias accusantium quo veritatis sunt quae! Quisquam magni quo cum delectus officiis necessitatibus excepturi voluptatum nisi corporis quas cupiditate minima laborum itaque autem omnis totam deserunt optio quia, accusamus soluta. Nulla beatae incidunt maiores aperiam facilis quae laudantium veritatis hic vel id. Veritatis repellendus sunt voluptatibus eligendi tenetur sint libero ut, mollitia beatae quia at culpa nulla dolorum dolor eius dicta facilis ratione, vitae expedita illo. Animi repellat, nihil, asperiores maxime ex voluptatibus veniam beatae aliquid deleniti consectetur, debitis necessitatibus! Eveniet repellat possimus libero tempore! Aperiam sapiente totam soluta veniam provident vel iusto excepturi corporis ipsum qui exercitationem ducimus quae officiis consequuntur, voluptatibus nihil quis odit consectetur eos molestias dolores! Accusantium, reprehenderit soluta debitis nesciunt rem earum molestias dicta harum facilis blanditiis corporis, expedita suscipit voluptatum nihil amet? Molestiae velit reiciendis magnam. Officia, molestiae quidem nam porro soluta non eveniet aliquam repellendus mollitia enim nostrum quae hic eligendi reiciendis sequi reprehenderit voluptatem quod sunt voluptate neque veritatis blanditiis explicabo iure qui? Doloribus ratione, consectetur modi nesciunt velit dolorem incidunt aperiam dolor nam tenetur unde quos magni, praesentium vitae, qui amet quae accusamus ipsum corrupti consequuntur totam nulla? Possimus dicta at eum quasi, provident nam vitae dolore et. Quisquam provident doloribus praesentium modi dolor. Ea distinctio necessitatibus aut eos! Expedita voluptates ratione cumque vitae odit dignissimos molestiae tempora. Consequuntur dolores est labore nesciunt nulla quod, fuga amet, quibusdam inventore vitae quaerat porro perferendis numquam error ipsam commodi. Libero exercitationem dolorum nemo itaque, porro iusto aliquid unde atque iste est? Voluptatibus voluptas quam architecto qui, dolor perferendis voluptates voluptate asperiores impedit possimus magni debitis. Hic doloremque vel debitis dolorem. Deleniti, cumque repellendus sapiente accusamus itaque dolore quo veritatis. Pariatur quod culpa nisi doloribus? Ut debitis temporibus, aspernatur eligendi, porro, unde commodi excepturi possimus officia architecto velit neque ipsam nesciunt. Quasi odio dolor itaque accusamus facilis, delectus tenetur unde aliquam, nihil culpa a et, maiores laborum. Rem assumenda quidem, accusantium ipsam voluptates inventore velit illum dolor perspiciatis reiciendis, nam ut incidunt non fuga. Sequi dicta quod quibusdam voluptate aut suscipit tempore, ipsa ea! Blanditiis, sint magnam ipsa esse facilis eius modi rerum sequi obcaecati repellendus at rem, nisi assumenda amet harum similique consectetur optio ipsum quaerat natus laboriosam quas dolores qui? A magnam quasi quas laboriosam assumenda. Magnam eveniet natus at iste! Quia modi quod praesentium repellat consequuntur nulla illum, ipsa animi voluptatum sapiente adipisci dignissimos dolorem voluptate nesciunt magni natus totam temporibus aspernatur corrupti vel cum sunt ex. Magni, deleniti molestias eaque sint, consequatur corporis iusto aliquam quis dignissimos doloremque placeat nulla laborum reiciendis. Sapiente, quis! Incidunt facilis numquam expedita voluptatibus et ullam repellat, accusantium excepturi qui quae? Ipsum perspiciatis, totam ipsa provident expedita consectetur culpa eaque tempore amet fuga alias, adipisci nemo sunt repellat at omnis impedit quis molestias ut! Placeat voluptatem odit veniam explicabo reiciendis aut repellat possimus modi illo, nesciunt ab non in repudiandae facilis sint aspernatur cupiditate a nihil consequuntur eligendi! Suscipit ullam laborum dolorum ex delectus maiores natus tempore hic quibusdam praesentium nesciunt harum nihil veritatis voluptatum quod sunt temporibus, voluptates perferendis est! Qui aperiam consequuntur magni quam a expedita fugiat, laborum modi quidem ut perspiciatis eligendi laudantium natus quo deleniti! Provident voluptatibus expedita quos pariatur, praesentium eveniet facilis rerum non repellendus nihil. Quisquam pariatur architecto sed, reiciendis eligendi laboriosam amet! Natus incidunt, reprehenderit non repellendus beatae suscipit corrupti officiis, saepe debitis amet quis atque aut maxime vitae? Vel alias hic deleniti, vero sequi voluptate ipsa magni fuga quibusdam neque libero voluptatem, eum repellendus, beatae ipsam eveniet corporis facilis? Iusto dolores aut quos illum cupiditate dolor natus ex hic ratione animi, vero aspernatur voluptate. Iure, provident?',
    //     ContentEng: 'Test Content Eng'
    // };

    // const attachData = [
    //     {
    //         id: 0,
    //         SubjectId: 1,
    //         FileName: "วิชาข้าว เพื่อชีวิตและสังคม",
    //         FileData: "",
    //         FileType: "pdf"
    //     },
    //     {
    //         id: 1,
    //         SubjectId: 1,
    //         FileName: "วิชาข้าว เพื่อชีวิตและสังคม",
    //         FileData: "",
    //         FileType: "docx"
    //     },
    //     {
    //         id: 2,
    //         SubjectId: 1,
    //         FileName: "วิชาข้าว เพื่อชีวิตและสังคม",
    //         FileData: "",
    //         FileType: "xlsx"
    //     }
    // ];

    const setFileType = (fileType) => {
        let classType = '';
        switch (fileType) {
            case 'pdf':
                classType = 'far fa-file-pdf'
                break;
            case 'docx':
                classType = 'far fa-file-word'
                break;
            case 'xlsx':
                classType = 'far fa-file-excel'
                break;
            default:
                classType = 'far fa-file-alt'
                break;
        }
        return classType + ' pt-1 '
    }

    useEffect(() => {
        fetchSubject();
    }, []);

    return (
        <>
            <div className="container pt-20 px-12 relative mx-auto lg:w-10/12 flex flex-wrap">
                <div className='mx-auto w-full header-bar'>
                    <div className="w-full lg:w-3/12">
                        <i className="fas fa-arrow-left text-sm cursor-pointer " onClick={() => history.goBack()}>
                            <span>&nbsp;กลับ</span>
                        </i>
                    </div>
                </div>

                <div className='w-full mt-3'>
                    <div className="min-h-screen-35 px-4 py-4 relative flex flex-col min-h-3 break-words bg-white w-full mb-6 rounded-lg shadow-lg">
                        <div className='w-full lg:w-10/12 text-base font-bold mx-auto mt-3 mb-3 leading-normal'>
                            {subjectData.SubjectNameTH}
                        </div>
                        {/* <div className='img-course lg:w-10/12 text-center flex flex-wrap mx-auto'>
                            <img
                                className="w-full align-middle img-subject"
                                src={subjectDataTemp.image} alt="" />
                        </div> */}
                        <div className='course-content lg:w-10/12 leading-none mx-auto py-3 mb-3 ReactQuill-Editor'>
                            <ReactQuill
                                theme="snow"
                                placeholder={"Write something awesome..."}
                                readOnly={true}
                                value={subjectData.ContentTH}
                                modules={{
                                    // syntax: true,
                                    toolbar: null
                                }}
                                formats={null}
                            />
                        </div>
                        <div className='font-bold w-full lg:w-10/12 mx-auto mb-1 mt-3 text-xs'>ไฟล์แนบ</div>
                        <div className='file-content lg:w-10/12 mx-auto mb-3 mt-3 text-xs'>
                            {
                                attachData.map(item => {
                                    return (
                                        <div className='flex flex-wrap mb-2 py-1 attach-list' key={item.id}>
                                                <span className='pt-1 text-blue-mju-front'><i className="fas fa-download"></i>&nbsp;&nbsp;ดาวน์โหลด&nbsp;&nbsp;</span> 
                                                <span><img src={require("assets/img/"+FilesService.changeImageType(item.FileType)).default} className="CourseFilePic"/></span><span className='mt-2'>&nbsp;&nbsp;{item.FileName}</span>
                                           
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
