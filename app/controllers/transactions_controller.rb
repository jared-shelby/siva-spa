class TransactionsController < ApplicationController
    def index
        transactions = Transaction.all
        render json: transactions, except: [:created_at, :updated_at, :user_id, :category_id], include: [:user, :category]
    end
end
