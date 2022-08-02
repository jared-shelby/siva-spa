class UsersController < ApplicationController
    # before_action :require_login

    def show
        user = User.find(params[:id])
        render json: user
    end

    def update
        user = User.find(params[:id])
        user.update(user_params)
        render json: user
    end

    private

    def user_params
        params.require(:user).permit(:name)
    end

    # for login
    # def require_login
    #     return head(:forbidden) unless session.include? :user_id
    # end
end
