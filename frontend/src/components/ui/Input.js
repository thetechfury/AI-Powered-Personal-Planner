const Input = ({type, placeholder, className}) => {
    return (
        <div className='w-full'>
            <input type={type} placeholder={placeholder} className={className}/>
        </div>
    )
};
export default Input;