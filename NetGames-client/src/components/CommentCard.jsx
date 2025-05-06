export default function CommentCard({ username, text }) {
  return (
    <div className="border-t border-gray-100 pt-3">
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{username}</p>
          <p className="text-sm text-gray-500">{text}</p>
        </div>
      </div>
    </div>
  );
}
