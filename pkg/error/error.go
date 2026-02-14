package error

import "fmt"

type ErrorType string

const (
	NotFound     ErrorType = "NOT_FOUND"
	Conflict     ErrorType = "CONFLICT"
	Internal     ErrorType = "INTERNAL"
	Unauthorized ErrorType = "UNAUTHORIZED"
	BadRequest   ErrorType = "BAD_REQUEST"
)

type Error struct {
	Type    ErrorType
	Message string
	Err     error
}

// Recreating standard error interface
func (e *Error) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

// helper unwrap function, allows 'errors.Is' and 'errors.As' to work
func (e *Error) Unwrap() error {
	return e.Err
}

// Error Constructors
func NotFoundError(msg string, err error) *Error {
	return &Error{Type: NotFound, Message: msg, Err: err}
}

func ConflictError(msg string, err error) *Error {
	return &Error{Type: Conflict, Message: msg, Err: err}
}

func InternalError(msg string, err error) *Error {
	return &Error{Type: Internal, Message: msg, Err: err}
}

func UnauthorizedError(msg string, err error) *Error {
	return &Error{Type: Unauthorized, Message: msg, Err: err}
}

func BadRequestError(msg string, err error) *Error {
	return &Error{Type: BadRequest, Message: msg, Err: err}
}
