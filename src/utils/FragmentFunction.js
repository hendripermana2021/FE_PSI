export function fragmentPoint(value, min, max){
    return new Intl.NumberFormat('en-US', 
        {
            minimumFractionDigits: min,
            maximumFractionDigits: max
        }).format(value)
} 