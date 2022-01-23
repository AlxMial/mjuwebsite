

import React, { useEffect, useState } from 'react'
import { useHistory, Link, useParams } from "react-router-dom";
import CommentBox from './CommentBox';
import ReactQuill from 'react-quill';
import urlPath from 'services/urlServer';
import FilesService from 'services/files'
import axios from 'axios';
import moment from 'moment';

import './subject.css'

export default function Subject() {

    const [listCourse,setListCourse] = useState([]);
    const [listSubject,setListSubject] = useState([]);
    const [listComment,setListComment] = useState([]);
    let { id } = useParams();

    const history = useHistory();

    async function fetchData() {
        let response = await axios(
            urlPath + `/courses/byId/${id}`
        );
        let user = await response.data;
        if (user !== null) {
            response.data.DescriptionTH = FilesService.buffer64UTF8(response.data.DescriptionTH)
            response.data.DescriptionENG = FilesService.buffer64UTF8(response.data.DescriptionENG)
            setListCourse(response.data);
        }
    }

    async function fetchDataSubject() {
        let response = await axios(urlPath + `/subjects/byCoursesId/${id}`);
        let subjects = await response.data;
        if (subjects !== null) {
            setListSubject(response.data);
        }
    }

    useEffect (  ()  =>  {
        fetchData();
        fetchDataSubject();
    },[]);

    const data = {
        post: {
            id: 1,
            content: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
            user: "Richard McClintock",
            userPic: "https://телеграм.мессенджеры.рус/wp-content/uploads/2016/04/garfild-dlya-telegram-online-16.png",
            publishDate: "2 Weeks ago",
            likes: 18,
            commentsNumber: 3,
        },
        comments: [
            {
                id: 0,
                user: "Bonorum Malorum",
                content: "Many desktop publishing packages and web page editors now use",
                userPic: "https://upload.wikimedia.org/wikipedia/ru/thumb/b/bc/Garfield_the_Cat.svg/1200px-Garfield_the_Cat.svg.png",
                publishDate: "2 days ago"
            },
            {
                id: 1,
                user: "Cicero Areals",
                content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
                userPic: "https://static.tgstat.ru/public/images/channels/_0/f0/f0f7f79a275a83bfe8769dfd81d40bb2.jpg",
                publishDate: "4 days ago"
            },
            {
                id: 2,
                user: "Hanna Pages",
                content: "Lorem Ipsum comes from sectionsof de Finibus Bonorum et Malorum (The Extremes of Good and Evil)",
                userPic: "https://vignette.wikia.nocookie.net/versus-compendium/images/0/09/Garfield.png/revision/latest?cb=20181122134939",
                publishDate: "1 Week ago"
            },
        ]
    };

    const subjectDataTemp = [
        {
            id: 0,
            SubjectNameTH: "ชื่อ Object TH",
            SubjectNameEng: "Object Name Eng",
            SubjectOfHour: "40"
        },
        {
            id: 1,
            SubjectNameTH: "ความรู้พื้นฐาน ถิ่นกำเนิด",
            SubjectNameEng: "kwamroo phuenthan thinkamnerd",
            SubjectOfHour: "120"
        },
        {
            id: 2,
            SubjectNameTH: "นายกฯ ไม่ยอมลาออกสักที แปดปีแล้วไอ่สัส",
            SubjectNameEng: "i here too",
            SubjectOfHour: "8"
        },
        {
            id: 3,
            SubjectNameTH: "นายกฯ ไม่ยอมลาออกสักที แปดปีแล้วไอ่สัส 2",
            SubjectNameEng: "i here too 2",
            SubjectOfHour: "80"
        },
        {
            id: 4,
            SubjectNameTH: "บางคนก็ไม่ยอมกลับบ้าน อยู่แต่เยมันดี",
            SubjectNameEng: "Leader of villege no. 10",
            SubjectOfHour: "55"
        },
        {
            id: 5,
            SubjectNameTH: "บางคนก็ไม่ยอมกลับบ้าน อยู่แต่เยมันดี 2",
            SubjectNameEng: "Leader of villege no. 10 2",
            SubjectOfHour: "90"
        }
    ];

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
                <h1 className='text-4xl px-2 py-2 THSarabunBold mt-4 font-bold'>{listCourse.CurriculumNameTH}</h1>
                <div className='w-full'>
                    <div className=" min-h-screen-35 px-4 py-4 relative flex flex-col min-h-3 break-words bg-white w-full mb-6 rounded-lg shadow-lg">
                        <div className='ReactQuill-Editor'>
                            <ReactQuill
                                theme="snow"
                                placeholder={"Write something awesome..."}
                                readOnly={true}
                                value={listCourse.DescriptionTH}
                                modules={{
                                    // syntax: true,
                                    toolbar: null
                                }}
                                formats={null}
                            />
                        </div>

                        <div className='subject-content px-4 py-1 rounded-lg lg:w-8/12 mx-auto mt-3 mb-3'>
                            {
                                listSubject.map((item) => {
                                    return (
                                        <Link to={'/home/content/'+item.id} key={item.id}>
                                            <div className='font-bold subjectName'>{item.SubjectNameTH}</div>
                                            <div className='text-mute subjectOfHour'>
                                                {item.SubjectOfHour} นาที
                                            </div>
                                        </Link>
                                    )
                                })
                            }
                        </div>

                        <div className='divComment'>
                            <hr className="mt-6 border-b-1 mb-6 border-blueGray-300" />
                            <CommentBox
                                comments={[]}
                                post={[]} 
                                CourseId={id.toString()}
                                />
                       

                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}
