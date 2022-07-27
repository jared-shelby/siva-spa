class CreateGoals < ActiveRecord::Migration[7.0]
  def change
    create_table :goals do |t|
      t.string :name
      t.decimal :amount
      t.datetime :target
      t.string :image
      
      t.references :user
      t.timestamps
    end
  end
end
