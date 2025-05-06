import CommentCard from './CommentCard';
import { useState } from 'react';
import { addComment } from '../actions/Score.action';
import { useCookies } from 'react-cookie';

export default function ScoreCard({ score_id, username, score, text, comments }) {
  const [commentText, setCommentText] = useState("");
  const [cookies] = useCookies(["user_id"]);

  const postComment = () => {
    console.log(score_id);
    addComment({
      text: commentText,
      post: score_id,
      author: cookies.user_id,
    })
      .then((response) => {
        if (response.data != null) {
          alert("Successfully post comment");
          window.location.reload();
        } else {
          alert("Failed to post comment!");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">{username}</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            Score: {score}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{text}</p>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
            <button
              onClick={postComment}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Comment
            </button>
          </div>
        </div>

        {comments && comments.length > 0 && (
          <div className="mt-4 space-y-3 pt-3">
            <h3 className="text-sm font-medium text-gray-500">Comments</h3>
            {comments.map((comment, index) => (
              <CommentCard
                key={index}
                username={comment.author.username}
                text={comment.text}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
