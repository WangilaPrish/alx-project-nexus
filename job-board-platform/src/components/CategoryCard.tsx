const CategoryCard = ({ icon, title, count, isHighlighted }) => {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border shadow-sm hover:shadow-md transition
      ${isHighlighted ? 'bg-blue-50 border-blue-400' : 'bg-white'}`}>
      <div className="text-3xl text-blue-600">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{count} jobs available</p>
      </div>
    </div>
  );
};

export default CategoryCard;
