class GoalsController < ApplicationController
    def index
        goals = Goal.all
        render json: goals, except: [:created_at, :updated_at, :user_id], include: [:user]
    end

    def create
        goal = Goal.create(goal_params)
        render json: goal, except: [:created_at, :updated_at, :user_id], include: [:user]
    end

    private

    def goal_params
        params.require(:goal).permit(:name, :amount, :target, :image, :user_id)
    end
end
