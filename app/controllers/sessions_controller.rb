class SessionsController < ApplicationController
    def new
    end

    def create
        user = User.find_by(email: params[:email])
        if user && user.authenticate(params[:password])
           session[:user_id] = user.id
           render json: user
        else
           render plain: "error - incorrect login"
        end
    end

    def destroy
        session.delete :user_id
    end
end 