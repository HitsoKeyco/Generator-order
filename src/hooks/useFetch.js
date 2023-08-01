import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const useFetch = (baseUrl) => {

    const [infoApi, setInfoApi] = useState([])


    //GENERAR ORDEN Y VALIDAR
    const generateOrder = (path,mount) => {
        const numberRandom = generateRandomNumber();
        const url = `${baseUrl}${path}`;
        axios.get(url, { params: { num_date: numberRandom } })
            .then((res) => {
                const date = res.data;
                const dataFiltered = date.filter(element => element.num_date == numberRandom);
                const valueFiltered = dataFiltered.length > 0;
                if (!valueFiltered) {
                    setInfoApi(numberRandom);
                    const insertOrder = {
                        num_date: numberRandom,
                        total_amount: mount
                    };
                    console.log(numberRandom,mount, valueFiltered)                    
                    axios.post(url, insertOrder)
                        .then((response) => {
                            // Aquí puedes hacer algo con la respuesta de la API después de insertar la orden
                        })
                        .catch((error) => {
                            console.log('Error al insertar orden:', error);
                        });
                } else {
                    generateOrder(path);
                }
            })
            .catch((err) => {
                console.log('Error al obtener datos:', err);
            });
    };



    const generateRandomNumber = () => {
        const numberRandom = Math.floor(Math.random() * (3500 - 2500 + 1)) + 2500;
        return numberRandom
    }




    //AUTENTICAR ORDER
    const autenticOrder = (path, data) => {
        const url = `${baseUrl}${path}/`
        axios.get(url)
            .then(res => {
                const date = res.data
                const dataFiltered = date.filter(element => element.num_date == data.num_date);
                const valueFiltered = dataFiltered.length > 0;
                setInfoApi(valueFiltered)
                if (!valueFiltered) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Orden incorrecta, por favor intentalo nuevamente',

                    })
                }
            })
            .catch(err => console.log(err))
    }

    //READ
    const getApi = (path) => {
        const url = `${baseUrl}${path}/`
        axios.get(url)
            .then(res => setInfoApi(res.data))
            .catch(err => console.log(err))
    }





    // CREATE
    const createRegister = (path, data, dataOrder) => {
        const url = `${baseUrl}${path}/`;
        return axios.post(url, data)
            .then(res => {
                const idCustomer = res.data.id;

                // Asignar customerId al objeto data antes de enviarlo
                data.customerId = idCustomer;

                setInfoApi(prevInfoApi => {
                    if (Array.isArray(prevInfoApi)) {
                        return [...prevInfoApi, res.data]; // Actualiza el estado con la nueva data
                    } else {
                        return [res.data]; // Si prevInfoApi no es un array, crea uno nuevo con el nuevo elemento
                    }
                });

                // Llamamos a updateIdCustomerInOrder después de actualizar el estado
                updateIdCustomerInOrder(idCustomer, dataOrder);

                return { success: true, data: res.data };
            })
            .catch(err => {
                console.log(err);
                return { success: false, error: err }; // Devuelve un objeto con éxito falso y el error
            });
    }




    const updateIdCustomerInOrder = (idCustomer, dataOrder) => {



        const url = `${baseUrl}/orders` // URL de la API para actualizar los registros en la tabla "orders"

        // Comprobar si hay algún registro donde dataOrder es igual a num_date
        axios.get(url, { params: { num_date: dataOrder } })
            .then(response => {
                const ordersToUpdate = response.data.filter(order => order.num_date == dataOrder);
                console.log(ordersToUpdate)

                // Si se encuentran registros con dataOrder igual a num_date
                if (ordersToUpdate.length > 0) {
                    // Actualizar el campo customerId en los registros encontrados
                    const updatePromises = ordersToUpdate.map(order => {
                        const orderId = order.id;
                        console.log(orderId)
                        const updateData = { customerId: idCustomer };
                        return axios.put(`${url}/${orderId}`, updateData);
                    });
                    // Ejecutar todas las solicitudes de actualización en paralelo
                    Promise.all(updatePromises)
                        .then(results => {
                            console.log('Registros actualizados:', results);
                        })
                        .catch(error => {
                            console.error('Error al actualizar registros:', error);
                        });
                } else {
                    console.log('No se encontraron registros con dataOrder igual a num_date.');
                }
            })
            .catch(error => {
                console.error('Error al obtener registros:', error);
            });
    };



    //DELETE

    const deleteRegister = (path, id) => {
        const url = `${baseUrl}${path}/${id}/`
        axios.delete(url)
            .then(res => {
                console.log(res.data)
                console.log('aqui')
                //filtramos los elementos para q retornen menos el elemento que eliminamos por id
                const infoApiFiltered = infoApi.filter(element => element.id !== id)
                setInfoApi(infoApiFiltered)
            })
            .catch(err => console.log(err))

    }

    //UPDATE


    const updateRegister = (path, id, data) => {
        const url = `${baseUrl}${path}/${id}/`
        axios.patch(url, data)
            .then(res => {
                console.log(res.data)
                const infoApiUpdate = infoApi.map(element => {
                    if (id === element.id) {
                        return data
                    } else {
                        return element
                    }
                })
                //retornamos los datos actualizados
                setInfoApi(infoApiUpdate)
            })
            .catch(err => console.log(err))

        //UPDATE IDCUSTOMER IN ORDER



    }

    return [
        infoApi,
        getApi,
        createRegister,
        deleteRegister,
        updateRegister,
        autenticOrder,
        generateOrder

    ]
}

export default useFetch