import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

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
            setCopyMessage("Número copiado");
            setTimeout(() => {
                setCopyMessage(null); // Limpiar el mensaje de copiado después de unos segundos
            }, 2000);
        }
    };

    return (
        <>
            <div className="generator_container">
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
