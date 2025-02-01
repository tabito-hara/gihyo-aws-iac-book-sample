import boto3


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


def on_create(client, event, context):
    props = event["ResourceProperties"]
    bucket, key, body = props["Bucket"], props["Key"], props["Body"]
    if check_object_exists(client, bucket, key):
        raise Exception(f"The object {key} already exists in the bucket {bucket}")
    client.put_object(Bucket=bucket, Key=key, Body=body)
    physical_id_to_return = f"{bucket}|{key}"
    return {"PhysicalResourceId": physical_id_to_return}


def on_update(client, event, context):
    physical_id = extract_physical_id(event)
    props = event["ResourceProperties"]
    bucket, key, body = props["Bucket"], props["Key"], props["Body"]
    physical_id_updated = f"{bucket}|{key}"
    if physical_id is None:
        raise Exception("PhysicalResourceId is not found in the event")
    elif physical_id != physical_id_updated and check_object_exists(client, bucket, key):
        raise Exception(f"The object {key} already exists in the bucket {bucket}")
    client.put_object(Bucket=bucket, Key=key, Body=body)
    physical_id_to_return = physical_id_updated
    return {"PhysicalResourceId": physical_id_to_return}


def on_delete(client, event, context):
    physical_id = extract_physical_id(event)
    if physical_id is None:
        raise Exception("PhysicalResourceId is not found in the event")
    bucket, key = physical_id.split("|")
    client.delete_object(Bucket=bucket, Key=key)
    physical_id_to_return = physical_id
    return {"PhysicalResourceId": physical_id_to_return}


def lambda_handler(event, context):
    action = event["RequestType"]
    handlers = {"Create": on_create, "Update": on_update, "Delete": on_delete}
    client = boto3.client("s3")
    handlers[action](client, event, context)
