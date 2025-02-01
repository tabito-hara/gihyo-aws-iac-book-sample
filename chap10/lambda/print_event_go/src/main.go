package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"encoding/json"
)

func HandleRequest(ctx context.Context, event *any) (error) {
	jsonStr, err := json.Marshal(event)
	if err != nil {
		return err
	}
	fmt.Println(string(jsonStr))
	return nil
}

func main() {
	lambda.Start(HandleRequest)
}
