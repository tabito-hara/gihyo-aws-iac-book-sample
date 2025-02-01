import cfnresponse
import boto3

FAILED_DUMMY_PHYSICAL_RESOURCE_ID = "FailedDummyPhysicalResourceId"


def check_object_exists(client, bucket, key):
    output = client.list_objects_v2(Bucket=bucket, Prefix=key)
    if "Contents" in output:
        for obj in output["Contents"]:
            if obj["Key"] == key:
                return True
    return False

def extract_physical_id(event):
    if "PhysicalResourceId" in event:
        return event["PhysicalResourceId"]
    else:
        return None

def on_create(client, event):
    try:
        props = event["ResourceProperties"]
        bucket, key, body = props["Bucket"], props["Key"], props["Body"]
        if check_object_exists(client, bucket, key):
            raise Exception(f"The object {key} already exists in the bucket {bucket}")
        client.put_object(Bucket=bucket, Key=key, Body=body)
        status = cfnresponse.SUCCESS
        physical_id_to_return = f"{bucket}|{key}"
    except Exception as e:
        print(e)
        status = cfnresponse.FAILED
        physical_id_to_return = FAILED_DUMMY_PHYSICAL_RESOURCE_ID
    finally:
        return status, physical_id_to_return


def on_update(client, event):
    try:
        physical_id = extract_physical_id(event)
        props = event["ResourceProperties"]
        bucket, key, body = props["Bucket"], props["Key"], props["Body"]
        physical_id_updated = f"{bucket}|{key}"
        if physical_id is None:
            physical_id = FAILED_DUMMY_PHYSICAL_RESOURCE_ID
            raise Exception("PhysicalResourceId is not found in the event")
        elif physical_id != physical_id_updated and check_object_exists(client, bucket, key):
            physical_id = FAILED_DUMMY_PHYSICAL_RESOURCE_ID
            raise Exception(f"The object {key} already exists in the bucket {bucket}")
        client.put_object(Bucket=bucket, Key=key, Body=body)
        status = cfnresponse.SUCCESS
        physical_id_to_return = physical_id_updated
    except Exception as e:
        print(e)
        status = cfnresponse.FAILED
        physical_id_to_return = physical_id
    finally:
        return status, physical_id_to_return


def on_delete(client, event):
    try:
        physical_id = extract_physical_id(event)
        if physical_id is None:
            physical_id = FAILED_DUMMY_PHYSICAL_RESOURCE_ID
            raise Exception("PhysicalResourceId is not found in the event")
        elif physical_id != FAILED_DUMMY_PHYSICAL_RESOURCE_ID:
            bucket, key = physical_id.split("|")
            client.delete_object(Bucket=bucket, Key=key)
        else:
            print("Skipping deletion of failed resource")
        status = cfnresponse.SUCCESS
        physical_id_to_return = physical_id
    except Exception as e:
        print(e)
        status = cfnresponse.FAILED
        physical_id_to_return = physical_id
    finally:
        return status, physical_id_to_return


def lambda_handler(event, context):
    action = event["RequestType"]
    handlers = {"Create": on_create, "Update": on_update, "Delete": on_delete}
    client = boto3.client("s3")
    status, physical_id_to_return = handlers[action](client, event)
    cfnresponse.send(event, context, status, {}, physical_id_to_return)
