import { Divider, Input } from "antd"
import { formatDate } from "../util"

const DisplayRequest = ({ request }) => {

    const {
        title,
        message,
        signatureRequestId,
        signatures,
        createdAt,
    } = request

    return <div>
        <Divider/>
        <h2>Selected: {title}</h2>
        <br/>
        {message && <p>{message}</p>}
        Request ID: {signatureRequestId}
        <br/>
        <br/>
        <h3>Signers:</h3>
        {(signatures || []).map((signature, index) => {
            return (
                <div key={index}>
                    <Input disabled value={`${signature.signerName} (${signature.signerEmailAddress})`} />
                </div>
            )
        })}

        {createdAt && <p className="standard-margin">Created at: {formatDate(createdAt)}</p>}
        <br/>

    </div>
}

export default DisplayRequest