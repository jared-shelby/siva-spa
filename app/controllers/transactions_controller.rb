class TransactionsController < ApplicationController
    def index
        transactions = Transaction.all
        render json: transactions
    end

    def create
        transaction = Transaction.create(transaction_params)
        render json: transaction
    end

    def destroy
        transaction = Transaction.find(params[:id]).destroy
        render json: transaction
    end

    private

    def transaction_params
        params.require(:transaction).permit(:amount, :date, :merchant, :user_id, :category_id)
    end
end
