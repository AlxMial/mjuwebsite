import React, { Component, useState } from 'react'
import { Link } from "react-router-dom";
import calendar from '../../../assets/img/calendar.png'
import planting from '../../../assets/img/planting.png'
import processing from '../../../assets/img/processing.png'
export default class card extends Component {



    render() {
        return (
            <>
                <Link to={this.props.value[0]}>
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-green-mju headCard">
                        <div className='bg-white rounded-lg card-home-top'>
                        <img
                        src={ ((this.props.value[1] === "ปฏิทิน") ? calendar : ((this.props.value[1] === "การปลูก") ? planting : processing))}
                        alt="..."
                        className='px-2 py-2'
                        ></img>
              
                        </div>
                        <blockquote className="relative p-8 mb-4">
                            <svg
                                preserveAspectRatio="none"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 583 95"
                                className="absolute left-0 w-full block h-95-px -top-94-px"
                            >
                                <polygon
                                    points="-30,95 583,95 583,10"
                                    className="text-green-200-mju fill-current"
                                ></polygon>
                            </svg>
                            <h4 className="text-xl font-bold text-white">
                                {this.props.value[1]}
                            </h4>
                        </blockquote>
                    </div>
                </Link>
            </>
        )
    }
}
