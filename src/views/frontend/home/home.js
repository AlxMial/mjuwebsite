import React from 'react'
import './home.css'

import Card from './card';

const items = [
    { id: "01", path: "/home/Curriculum/1", name: "ปฏิทิน",picture:"assets/img/calendar.png" },
    { id: "02", path: "/home/Curriculum/2", name: "การปลูก",picture:"assets/img/planting.png" },
    { id: "03", path: "/home/Curriculum/3", name: "การแปรรูป",picture:"assets/img/processing.png" }
];

const itemList = items.map((item) => (
    <div key={item.id} className="w-full px-4 flex-1">
        <Card value={[item.path, item.name,item.picture]}></Card>
    </div>
));

export default function home() {
    return (
        <>
            <div className="relative pt-20 pb-32 flex max-h-screen-37 bg-darkgreen-mju">
                <div className="container px-4 relative mx-auto w-10/12">
                    <div className="w-full x-4 ml-auto mr-auto px-4">
                        <h1 className="text-white font-semibold text-5xl">
                            สวัสดี...
                        </h1>
                        <p className="mt-4 text-lg text-blueGray-200 text-bold  THSarabunBold">
                            ยินดีต้อนรับสู่ห้องเรียนออแกนิค
                        </p>
                    </div>
                </div>
            </div>
            <div className="container px-4 mx-auto -mt-16 w-10/12">
                <div className="flex flex-wrap">
                    {itemList}
                </div>
            </div>
        </ >
    )
}
