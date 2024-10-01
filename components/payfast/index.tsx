import React from "react"
import { Paystack } from "react-native-paystack-webview"



const Pay = React.forwardRef((props, ref) => {


    return <Paystack
    ref={ref}
    paystackKey="your-public-key-here"
    amount={'25000.00'}
    billingEmail="paystackwebview@something.com"
    activityIndicatorColor="green"
    onCancel={(e) => {
      // handle response here
    }}
    onSuccess={(res) => {
      // handle response here
    }}
    autoStart={true}
  />
})

export default Pay