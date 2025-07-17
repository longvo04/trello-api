import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res) => {
  try {
    res.status(StatusCodes.CREATED).json({ message: 'Board created successfully' })
  } catch (error) {
    // console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error_message: error.message
    })
  }

}

export const boardController = {
  createNew
}
