class TransactionsController < ApplicationController
    def index
        transactions = Transaction.all
        render json: transactions, except: [:created_at, :updated_at, :user_id, :category_id], include: [:user, :category]
    end

    def create
        transaction = Transaction.create(transaction_params)
        render json: transaction, except: [:created_at, :updated_at, :user_id, :category_id], include: [:user, :category]
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
