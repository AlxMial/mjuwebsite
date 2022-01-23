import React, { Component } from 'react'
import './subject.css'
import propTypes from 'prop-types'
import moment from 'moment';
import urlPath from 'services/urlServer';
import axios from 'axios';
import FilesService from 'services/files'

class Post extends React.Component {
    state = {
        like: false,
    };

    addLike = () => {
        let changeLike = this.state.like;
        let add;
        // eslint-disable-next-line no-unused-expressions
        changeLike ? (changeLike = false, add = -1)
            : (changeLike = true, add = 1)

        this.setState({
            like: changeLike,
        })

        this.props.onAddLike({
            likes: this.props.likes + add,
        });

    }
    render() {
        return (
            <div className="post text-sm font-bold">
                <div className="desc"><i className="far fa-comment-alt"></i><span>&nbsp;&nbsp;{this.props.commentsNumber}</span>&nbsp;&nbsp;Comments</div>
                {/* <div className="postBody">
                    <img src={this.props.userPic} className="postPic" alt="user Pic" />
                    <div className="postContent">
                        <div className="postHeader">
                            <h2 className="postAuthor" id={this.props.id}>{this.props.user}</h2>
                            <span className="publishDate">{this.props.publishDate}</span>
                        </div>
                        <span className="postText">{this.props.content}</span>
                        <div className="postDesc">
                            <span className="desc">
                                {this.state.like
                                    ? <i onClick={this.addLike} className="fas fa-heart"></i>
                                    : <i onClick={this.addLike} className="far fa-heart"></i>}
                                <span>{this.props.likes} </span>
                                Likes
                            </span>
                            <span className="desc"><i class="far fa-comment"></i><span>{this.props.commentsNumber}</span> Comments</span>
                        </div>
                    </div>
                </div>
                {this.props.children} */}
            </div>
        );
    }
}

Post.propsTypes = {
    userPic: propTypes.string.isRequired,
    publishDate: propTypes.string.isRequired,
    likes: propTypes.number.isRequired,
    commentsNumber: propTypes.number.isRequired,
    id: propTypes.number.isRequired,
    user: propTypes.string.isRequired,
    content: propTypes.string.isRequired,
    onAddLike: propTypes.func.isRequired,
}

const Comment = props =>
    <div className="comment">
        <img src={props.userPic} className="commentPic" alt="user Pic" />
        <div className="commentBody">
            <div className="commentHeader">
                <h3 className="commentAuthor">{props.user}</h3>
                <span className="publishDate">{props.publishDate}</span>
            </div>
            <span className="commentContent">{props.content}</span>
        </div>
    </div>

Comment.propTypes = {
    id: propTypes.number.isRequired,
    user: propTypes.string.isRequired,
    content: propTypes.string.isRequired,
    userPic: propTypes.string.isRequired,
};

class CreateComment extends React.Component {

    state = {
        content: ""
    };

    handleTextChange = e => {
        const content = e.target.value;
        this.setState({
            content,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const fullName = localStorage.getItem('fullName');
        const profilePicture = localStorage.getItem('profilePicture');
        const timeago = moment(new Date()).fromNow();
        this.props.onCommentSubmit({
            user: fullName,
            content: this.state.content.trim(),
            userPic: profilePicture,
            publishDate: timeago
        });
        this.setState({
            content: "",
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="createComment p-2 rounded-lg">
                <label htmlFor="comment" className='text-sm font-bold mt-2'>ความคิดเห็น</label>
                <textarea className='textComment rounded-lg text-sm px-2 py-2'
                    id="comment"
                    type="text"
                    placeholder="ความคิดเห็นของคุณ"
                    value={this.state.content}
                    onChange={this.handleTextChange}
                    required />
                <div className='btnComment w-full text-right'>
                    <button className='btn-cancel lg:w-2/12 py-1 text-sm buttonOutlineNone font-bold' type="button">ยกเลิก</button>
                    <button className='btn-comment lg:w-2/12 py-1 text-sm px-2 py-2  font-bold' type="submit">โพสต์</button>
                </div>
            </form>
        );
    }
}

CreateComment.propTypes = {
    onCommentSubmit: propTypes.func.isRequired,
    content: propTypes.string
};



export default class CommentBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: this.props.comments,
            likes: this.props.post.likes,
            commentsNumber: this.props.post.commentsNumber,
            CourseId:this.props.CourseId
        };
        this.fetchDataComment(this.state.CourseId);
    }
    
    fetchDataComment = (id) => {

        const defaultPicture = require("assets/img/noimg.png").default;

        axios.get(urlPath+`/comments/byCourse/${id}`,{
            headers: {accessToken : localStorage.getItem("accessToken")}
          }).then((response) => {
            if(response.data !== null) {
                var JsonLearning = [];
                response.data.forEach(val => {
                    JsonLearning.push({id:val.id,user: val.UserName,content: val.TextComment,userPic:((val.UserImage.data.length === 0) ? defaultPicture : FilesService.buffer64(val.UserImage)),publishDate:moment(val.createdAt).fromNow() });
                });
                this.setState({comments:JsonLearning});
                this.setState({commentsNumber:JsonLearning.length});
            }
        });
    } 

    handleCommentSubmit = comment => {
        const comments = this.state.comments;
        comment.id = Date.now();
        const newComments = [comment].concat(comments);
        const defaultPicture = require("assets/img/noimg.png").default;
        const fullName = localStorage.getItem('fullName');
        const profilePicture = ((localStorage.getItem('profilePicture') === "") ?  defaultPicture :  localStorage.getItem('profilePicture'));
        const email = localStorage.getItem('email');
        const data = {
            TextComment: comment.content,
            UserName:fullName,
            UserImage:profilePicture,
            RelatedTable:"Courses",
            RelatedId:this.state.CourseId,
            CourseId:this.state.CourseId,
            IsDeleted:false,
            AddBy:email,
            EditBy:''
        }
        this.InsertComment(data)
        this.setState({
            comments: newComments,
            commentsNumber: this.state.commentsNumber + 1,
        });
    }

    InsertComment = value => {
        axios.post(urlPath+"/comments",value,{
            headers: {accessToken : localStorage.getItem("accessToken")}
          }).then((response)=>{
            if(response.data.error) 
            {
                console.log(response.data.error);
            }
        });
    }

    handleLike = changeLikesNum => {
        const LikesNum = changeLikesNum.likes;
        this.setState({
            likes: LikesNum,
        });
    }

    render() {
        return (
            <div className="commentBox w-full">
                <Post
                    publishDate={this.props.post.publishDate}
                    userPic={this.props.post.userPic}
                    likes={this.state.likes}
                    commentsNumber={this.state.commentsNumber}
                    id={this.props.post.id}
                    content={this.props.post.content}
                    user={this.props.post.user}
                    onAddLike={this.handleLike}>
                    <CreateComment
                        onCommentSubmit={this.handleCommentSubmit}
                    />
                </Post>
                <CreateComment
                    onCommentSubmit={this.handleCommentSubmit}
                />
                {
                    this.state.comments.map((comment) =>
                    <Comment
                        publishDate={comment.publishDate}
                        key={comment.id}
                        id={comment.id}
                        content={comment.content}
                        user={comment.user}
                        userPic={comment.userPic} />
                    )
                }
            </div>
        )
    }
}

CommentBox.propTypes = {
    post: propTypes.arrayOf(propTypes.object),
    comments: propTypes.arrayOf(propTypes.object),
    CourseId: propTypes.string
};

