
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { getLocalStorageToken, removeLocalStorageToken, TokenContext } from '../Token';
import { useRouter } from 'next/router';

const CommitQuestion = ({question}) => {
    const id = getLocalStorageToken('id');
    const router = useRouter();
    const handleQuestion = async()=> {
        try {
            const { data } = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/submit-question', {
                user_id: id,
                title : question.title,
                about : question.about,
                content : question.content,
                type : question.type
            });


            if (data.code === 1) {
                router.replace("/faq");
            }else {
                alert("提交失败");
            }
            

        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    return (
        <Button onClick = {handleQuestion} >提交</Button>
    )

}

export default CommitQuestion;