class GoalsController < ApplicationController
    def index
        goals = Goal.all
        render json: goals, except: [:created_at, :updated_at, :user_id], include: [:user]
    end
end
