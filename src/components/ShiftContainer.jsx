function ShiftContainer({ data, tabState }) {
    debugger
    return (
        <>
            {
                tabState.map((i) => {
                    if(i.isActive) {
                        return i.component(data)
                    }
                })
            }
        </>
    )
}

export default ShiftContainer