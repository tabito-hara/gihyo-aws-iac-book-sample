import json
import cfnresponse

def lambda_handler(event, context):
    try:
        print(json.dumps(event))
        cfnresponse.send(event, context, cfnresponse.SUCCESS, {}, "CustomResourcePhysicalID")
    except Exception as e:
        print(e)
        cfnresponse.send(event, context, cfnresponse.FAILED, {}, "CustomResourcePhysicalID")

# 物理IDを変化させる場合
'''
def lambda_handler(event, context):
    try:
        print(json.dumps(event))
        physical_id = event["ResourceProperties"]["Greeting"]
        cfnresponse.send(event, context, cfnresponse.SUCCESS, {}, physical_id)
    except Exception as e:
        print(e)
        cfnresponse.send(event, context, cfnresponse.FAILED, {}, physical_id)
'''