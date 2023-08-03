import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Toaster, toast } from "react-hot-toast";

const Generator = ({ generateOrder, infoApi }) => {
    const [numberRandm, setNumberRandm] = useState('0000');    
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


    

    return (
        <>
            <div className="generator_container">
                <span className="title_generator">ORDENES</span>
                <form onSubmit={handleSubmit(handleGenerateNumber)}>                    
                    <label className="input_total_amount" htmlFor="">Monto:</label>
                    <input className="total_amount" type="text" {...register('monto', { required: true })}/>

                    <button type="submit">Generar</button>
                    <CopyToClipboard text={`Ingrese el N° de orden ${numberRandm}            En el  siguiente link y posteriormente todos los datos para el respectivo envío. https://datos-de-envio-everchic.netlify.app/`}>
                    <label onClick={() => toast('Orden copiada ❤')} className="label_order" >{numberRandm}</label>
                    </CopyToClipboard>
                    <Toaster />
                </form>
                
            </div>
        </>
    );
};

export default Generator;
