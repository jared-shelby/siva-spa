class GoalsController < ApplicationController
    def index
        goals = Goal.all
        render json: goals
    end

    def create
        goal = Goal.create(goal_params)
        render json: goal
    end

    def update
        goal = Goal.find(params[:id])
        amount = goal.funded + params[:funded].to_f
        goal.update(funded: amount)
        render json: goal
    end

    def destroy
        goal = Goal.find(params[:id]).destroy
        render json: goal
    end

    private

    def goal_params
        params.require(:goal).permit(:name, :amount, :funded, :description, :target, :image, :user_id)
    end
end
