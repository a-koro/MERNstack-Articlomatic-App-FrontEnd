import React, { useState } from 'react';
import Axios from 'axios';
import UserContext from '../context/UserContext';

export default function Article(props) {

    const [dateTime, setDateTime] = useState(new Date());
    const [editable, setEditable] = useState(false);
    const [content, setContent] = useState(props.article.content);
    const {userData} = React.useContext(UserContext);

    function convertDateTime() {
        let timeStamp = props.article._id.toString().substring(0, 8);
        setDateTime(new Date(parseInt(timeStamp, 16) * 1000));
    }

    function editArticle() {

        setEditable(true);
    }

    async function updateArticle(evt) {

        try {
            await Axios.post(
                '/api/updateArticle',
                {
                    'id': props.article._id,
                    'content': content
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': userData.token
                    }
                }
            );
            setEditable(false);
        } catch(err) {
            console.log(err.response.data.msg);
        }
    }

    async function deleteArticle() {
        try {
            await Axios.delete(
                '/api/deleteArticle',
                {
                    headers: {
                        id: props.articleId,
                        'x-auth-token': userData.token
                    }
                }
            );
            props.update.setUpdate(!props.update.update);
        } catch(err) {
            console.log(err.response.data.msg);
        }
    };

    React.useEffect(() => {
        convertDateTime();
    }, []);

    return (
        <div className="card mt-2">
            <div className="card-header">
                <div className="float-left"><h1 className="mt-2 font-italic">{props.article.title}</h1></div>
                { ( (userData.user) && ((userData.user.id == props.article.user._id) || (userData.user.role === "admin"))) &&
                    <div className="float-right">
                        <span className="mr-2">Category: {props.article.category.name}</span>
                        { editable &&
                            <button type="button" className="btn btn-outline-warning mx-1" onClick={updateArticle}>Update</button>
                        }
                        { !editable &&
                            <button type="button" className="btn btn-outline-warning mx-1" onClick={editArticle}>Edit</button>
                        }
                        <button type="button" className="btn btn-outline-danger mx-1" onClick={deleteArticle}>Delete</button>
                    </div>
                }
            </div>
            <div className="card-body">
                { props.article.image &&
                    <img className="card-img-top" src={"/api/articleImage?articleId=" + props.article._id} alt="Article Image"/>
                }
                <blockquote className="blockquote mb-0">
                    { editable &&
                    <div className="input-group">
                        <textarea type="text" className="form-control" rows="20" minLength="2" maxLength="4000" value={content} onChange={evt => setContent(evt.target.value)}></textarea>
                    </div>
                    }
                    { !editable &&
                        <p style={{'whiteSpace':'pre-wrap'}} className="font-italic">{content}</p>
                    }
                    <div>
                        <span className="float-left"><small># {props.article.user.firstName + " " + props.article.user.lastName}</small></span>
                        <span className="float-right"><small>{dateTime.toLocaleTimeString("en-UK") + " " + dateTime.toLocaleDateString("en-UK")}</small></span>
                    </div>
                </blockquote>
            </div>
        </div>
    );
}