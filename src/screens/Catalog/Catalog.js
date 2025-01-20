import React, { useContext, useEffect, useState } from "react";
import cls from "./Catalog.module.scss";
import getWildberriesGoods from "../../shared/lib/getGoods";
import MyContext from "../../Context/Context";
import NumberFormatter from "../../shared/ui/NumberFormatter";

function Catalog() {
    const { APIValue } = useContext(MyContext);
    const [goods, setGoods] = useState(null);
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemDiscounts, setItemDiscounts] = useState({});
    const [globalDiscount, setGlobalDiscount] = useState("");
    const [itemsToBackend, setItemsToBackend] = useState([]);
    const [cycles, setCycles] = useState("");
    const [finalBackendQuery, setFinalBackendQuery] = useState({});
    const [fbq, setFbq] = useState();

    const handleGlobalDiscountApply = () => {
        const numValue = parseInt(globalDiscount) || 0;
        if (numValue <= 60) {
            const updatedDiscounts = {};
            goods?.data?.listGoods.forEach(item => {
                updatedDiscounts[item.vendorCode] = numValue;
            });
            setItemDiscounts(updatedDiscounts);
        }
    };

    const handleDiscountChange = (itemId, value) => {
        const numValue = parseInt(value) || 0;

            setItemDiscounts(prev => ({
                ...prev,
                [itemId]: numValue
            }));

    };

    const handleLaunch = () => {
        const selectedWithDiscounts = selectedItems.map(item => ({
            vendorCode: item.vendorCode,
            nmID: item.nmID,
            currentPrice: item.sizes[0].price,
            discount: itemDiscounts[item.vendorCode] || 0,
            newPrice:
                item.sizes[0].price *
                (1 - (itemDiscounts[item.vendorCode] || 0) / 100)
        }));
        setItemsToBackend(selectedWithDiscounts);
    };

    const handleBackend = async () => {
        if (selectedItems.length > 0 && cycles > 0) {
            const _finalBackendQuery = {
                cycles: parseInt(cycles),
                items: itemsToBackend
            };
            const val = _finalBackendQuery.items.map((item) => ({
                price: item.discount,
                prevPrice: parseInt(item.currentPrice),
                id: parseInt(item.nmID)
            }));

            setFbq({
                cycles: _finalBackendQuery.cycles,
                items: val
            });

            setFinalBackendQuery(_finalBackendQuery);
            console.log("finalBackendQuery:", _finalBackendQuery);

            try {
                let dataToBackend = {
                    cycles: _finalBackendQuery.cycles,
                    items: val
                };
                console.log("JSON.stringify: ", JSON.stringify(dataToBackend));
                const response = await fetch("https://wbbotbackend-production.up.railway.app/start-task", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataToBackend)
                });

                if (!response.ok) {
                    throw new Error(`Ошибка сервера: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Ответ сервера:", data);
            } catch (error) {
                console.error("Произошла ошибка:", error);
            }
        }
    };

    const handleCheckboxChange = (item) => {
        setSelectedItems(prev => {
            const isSelected = prev.some(
                selected => selected.vendorCode === item.vendorCode
            );
            if (isSelected) {
                return prev.filter(
                    selected => selected.vendorCode !== item.vendorCode
                );
            } else {
                return [...prev, item];
            }
        });
    };

    const renderGoods = () => {
        if (!goods) return <div>Нет товаров</div>;
        return goods.data.listGoods.map((item) => {
            const isChecked = selectedItems.some(
                selected => selected.vendorCode === item.vendorCode
            );
            const currentDiscount = itemDiscounts[item.vendorCode] || 0;
            const currentPrice = item.sizes[0].price;
            const discountedPrice = currentDiscount;

            return (
                <div className={cls.itemCard} key={item.vendorCode}>
                    <div className={cls.cardHeader}>
                        <input
                            className={cls.checkBox}
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(item)}
                        />
                        <span>Выбрать товар</span>
                    </div>
                    <p className={cls.cardInfo}><strong>Название:</strong> {item.vendorCode}</p>
                    <p className={cls.cardInfo}><strong>ID:</strong> {item.nmID}</p>
                    <p className={cls.cardInfo}><strong>Текущая цена:</strong>  <NumberFormatter value={currentPrice}></NumberFormatter> руб.</p>

                    <div>
                        {/*<p style={{ fontWeight: "600", marginBottom: "4px" }}>Параметры для алгоритма:</p>*/}
                        <div className={cls.cardParams}>
                            <strong>Новая цена:</strong>
                            <input
                                className={cls.inputNumber}
                                type="number"
                                value={currentDiscount}
                                onChange={(e) => handleDiscountChange(item.vendorCode, e.target.value)}
                            />
                            <span>Руб.</span>
                        </div>
                        {/*<p className={cls.cardInfo}>*/}
                        {/*    <strong>Цена во время прокрутки:</strong> {currentDiscount} руб.*/}
                        {/*</p>*/}
                    </div>
                </div>
            );
        });
    };

    const handleSendDataToBackend = async () => {
        try {
            console.log("fbq", fbq);
            // Пример отправки, если понадобится
            // const response = await fetch('http://localhost:3000/start-task', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(fbq),
            // });
            //
            // if (!response.ok) {
            //     throw new Error(`Ошибка сервера: ${response.statusText}`);
            // }
            //
            // const data = await response.json();
            // console.log('Ответ сервера:', data);
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    };

    useEffect(() => {
        const fetchGoods = async () => {
            setIsLoading(true);
            try {
                const response = await getWildberriesGoods(APIValue);
                setGoods(response.data);
                setStatus("Success");
            } catch (error) {
                setStatus(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        if (APIValue) {
            fetchGoods();
        }
    }, [APIValue]);

    useEffect(() => {
        handleLaunch();
    }, [globalDiscount, cycles, selectedItems, itemDiscounts]);

    return (
        <div className={cls.Login}>
            <h1 className={cls.title}>Каталог товаров</h1>

            {/* Установка глобальной скидки */}
            {/*<div className={cls.discountAllContainer}>*/}
            {/*    <div className={cls.discountAllHeader}>*/}
            {/*        Установить скидку сразу на все товары*/}
            {/*    </div>*/}
            {/*    <div className={cls.discountAllRow}>*/}
            {/*        <label htmlFor="globalDiscount">Скидка:</label>*/}
            {/*        <input*/}
            {/*            className={cls.inputNumber}*/}
            {/*            id="globalDiscount"*/}
            {/*            type="number"*/}
            {/*            value={globalDiscount}*/}
            {/*            onChange={(e) => setGlobalDiscount(e.target.value)}*/}
            {/*            min="0"*/}
            {/*            max="60"*/}
            {/*        />*/}
            {/*        <button*/}
            {/*            className={cls.setButton}*/}
            {/*            onClick={handleGlobalDiscountApply}*/}
            {/*        >*/}
            {/*            Установить*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Установка циклов */}
            <div className={cls.cyclesContainer}>
                <div className={cls.discountAllHeader}>
                    Установить количество циклов изменения цен
                </div>
                <div className={cls.cyclesRow}>
                    <label htmlFor="cyclesInput">Циклы:</label>
                    <input
                        className={cls.inputCycles}
                        id="cyclesInput"
                        type="number"
                        value={cycles}
                        onChange={(e) => setCycles(e.target.value)}
                        min="1"
                    />
                    <button
                        className={cls.setButton}
                        onClick={() => console.log("Cycles set to:", cycles)}
                    >
                        Установить
                    </button>
                </div>
            </div>

            {/* Кнопка запуска скрипта */}
            <button
                className={cls.mainButton}
                onClick={handleBackend}
            >
                Запустить скрипт
            </button>

            {/* Вывод товаров */}
            {isLoading ? (
                <div>Загрузка товаров...</div>
            ) : goods ? (
                <div className={cls.goodsContainer}>
                    {/* Список выбранных товаров (предварительный просмотр) */}
                    <p className={cls.selectedItemsTitle}>Список товаров для отправки:</p>
                    {itemsToBackend && itemsToBackend.length > 0 && (
                        <div className={cls.selectedItemsBlock}>

                            <ul style={{listStyle: "none", padding: 0, margin: 0}}>
                                {itemsToBackend.map((item, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            padding: "8px",
                                            backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff",
                                            borderRadius: "4px",
                                            marginBottom: "4px"
                                        }}
                                    >
                                        <strong>Название:</strong> {item.vendorCode}
                                        <br/>
                                        <strong>ID:</strong> {item.nmID}
                                        <br/>
                                        <strong>Цена сейчас:</strong>  <NumberFormatter value={item.currentPrice}></NumberFormatter>  Руб
                                        <br/>
                                        <strong>Новая цена:</strong> <NumberFormatter value={item.discount}></NumberFormatter> Руб

                                    </li>
                                ))}
                            </ul>
                            <div>
                                <strong>Количество циклов:</strong> {cycles}
                            </div>
                        </div>
                    )}

                    <div style={{
                        marginBottom: "18px",
                        fontWeight: "bold",
                    }}>Выбрано товаров: {selectedItems.length}</div>

                    {/* Карточки товаров из WB */}
                    {renderGoods()}
                </div>
            ) : (
                <div>Товары не загружены.</div>
            )}

            {/* Статус */}
            <div className={cls.status}>
                Статус: {status || "Неизвестный"}
            </div>
        </div>
    );
}

export default Catalog;
