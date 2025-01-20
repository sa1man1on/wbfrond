

const NumberFormatter = ({ value }) => {
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return <span>{formatNumber(value)}</span>;
};

export default NumberFormatter;
