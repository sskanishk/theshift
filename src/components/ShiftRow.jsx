function ShiftRow({item}) {
    console.log("item ", item)
    return (
        <div>
            {
                item.slots.map((foo, i) => {
                    return (
                        <div key={`sh${i}`}>
                            {foo.area}
                        </div>
                    )
                })
            }
        </div>
    )
    
}

export default ShiftRow