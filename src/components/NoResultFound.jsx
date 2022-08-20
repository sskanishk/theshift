import noResult from '../assets/no_result.png'

function NoResultFound() {
    return (
        <div style={{display: "flex", justifyContent: "center", aligItems: "center", padding: "20px 50px"}}>
            <img src={noResult} width="400px"/>
        </div>
    )
}

export default NoResultFound