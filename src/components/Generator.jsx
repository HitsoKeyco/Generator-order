import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
const Generator = ({ generateOrder, infoApi }) => {
    const [numberRandm, setNumberRandm] = useState('0000');
    const [copyMessage, setCopyMessage] = useState(null);
    const { register, reset, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        setNumberRandm(infoApi);
    }, [infoApi]);

    const handleGenerateNumber = (data) => {                
        const mount = data.monto;
        generateOrder('/orders', mount);
        reset({
            monto: ''
        });
    };

    const handleCopyNumber = () => {
        if (numberRandm) {
            navigator.clipboard.writeText(numberRandm);
            
            setTimeout(() => {
                Swal.fire('Numero Copiado');
            }, 300);
        }
    };
    

    return (
        <>
            <div className="generator_container">
                <span className="title_generator">ORDENES</span>
                <form onSubmit={handleSubmit(handleGenerateNumber)}>                    
                    <label className="input_total_amount" htmlFor="">Monto:</label>
                    <input className="total_amount" type="text" {...register('monto', { required: true })}/>

                    <button type="submit">Generar</button>
                    <label className="label_order" onTouchStart={handleCopyNumber}>{numberRandm}</label>
                </form>
                {copyMessage && <p>{copyMessage}</p>}
            </div>
        </>
    );
};

export default Generator;
