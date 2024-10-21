const Input = ({type, placeholder,value,onChange,onKeyDown, className}) => {
    return (
        <div className='w-full'>
            <input value={value} type={type} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder} className={className}/>
        </div>
    )
};
export default Input;