class MilestonesController < ApplicationController
    def index
        milestones = Milestone.all
        render json: milestones
    end

    def create
        milestone = Milestone.create(milestone_params)
        render json: milestone
    end

    def update
        milestone = Milestone.find(params[:id])
        amount = milestone.funded + params[:funded].to_f
        milestone.update(funded: amount)
        render json: milestone
    end

    def destroy
        milestone = Milestone.find(params[:id]).destroy
        render json: milestone
    end

    private

    def milestone_params
        params.require(:milestone).permit(:name, :amount, :funded, :description, :target, :image, :user_id)
    end
end
