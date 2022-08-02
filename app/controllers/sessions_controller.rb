# class SessionsController < ApplicationController
#     def new
#     end

#     def create
#         session[:user_id] = params[:user_id]
#         render plain: "success!"
#     end

#     def destroy
#         session.delete :user_id
#     end
# end 