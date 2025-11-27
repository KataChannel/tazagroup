#!/bin/bash

# Interactive Menu for Development Scripts - TAZAGROUP ONLY
# Each command runs in a separate terminal

# Colors for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored text
print_color() {
    color=$1
    shift
    echo -e "${color}$@${NC}"
}

# Function to run command in new terminal
run_in_terminal() {
    local title=$1
    local command=$2
    
    # Check if running in VS Code integrated terminal
    if [[ -n "$TERM_PROGRAM" && "$TERM_PROGRAM" == "vscode" ]]; then
        # Running in VS Code - use tmux or screen for split terminals
        if command -v tmux &> /dev/null; then
            # Use tmux to create new pane
            tmux split-window -h "bash -c '$command; echo; echo Press Enter to close...; read'"
        else
            # Fallback: run in background and show output
            print_color $CYAN "Starting: $title"
            eval "$command &"
            echo "PID: $!"
        fi
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$title" -- bash -c "$command; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -title "$title" -hold -e "$command" &
    elif command -v konsole &> /dev/null; then
        konsole --title "$title" -e bash -c "$command; exec bash" &
    elif command -v terminator &> /dev/null; then
        terminator --title="$title" -e "bash -c '$command; exec bash'" &
    else
        # Fallback: run in current terminal
        print_color $YELLOW "No compatible terminal found. Running in current terminal..."
        eval "$command"
    fi
}

# Clear screen
clear

# Main menu
while true; do
    print_color $CYAN "╔════════════════════════════════════════════════════════════╗"
    print_color $CYAN "║          🚀 TAZAGROUP DEVELOPMENT MENU 🚀                 ║"
    print_color $CYAN "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_color $GREEN "📦 DEVELOPMENT:"
    echo "  1)  dev                    - Run both backend + frontend"
    echo "  2)  dev:backend            - Run backend only (Port 13001)"
    echo "  3)  dev:frontend           - Run frontend only (Port 13000)"
    echo ""
    
    print_color $YELLOW "🏗️  BUILD & DEPLOYMENT:"
    echo "  4)  build                  - Build both backend + frontend"
    echo "  5)  build:backend          - Build backend only"
    echo "  6)  build:frontend         - Build frontend only"
    echo ""
    
    print_color $CYAN "🗄️  DATABASE OPERATIONS:"
    echo "  7)  db:studio              - Open Prisma Studio"
    echo "  8)  db:migrate             - Run database migration"
    echo "  9)  db:push                - Push schema to database"
    echo "  10) db:seed                - Seed database"
    echo "  11) db:backup              - Backup database"
    echo "  12) db:restore             - Restore database"
    echo ""
    
    print_color $RED "🐳 DOCKER OPERATIONS:"
    echo "  13) docker:up              - Start Docker services"
    echo "  14) docker:down            - Stop Docker services"
    echo "  15) docker:logs            - View Docker logs"
    echo "  16) docker:build           - Build Docker images"
    echo ""
    
    print_color $GREEN "🔧 UTILITIES:"
    echo "  17) setup                  - Install all dependencies"
    echo "  18) clean                  - Clean node_modules and lockfiles"
    echo "  19) lint                   - Run linters"
    echo "  20) format                 - Format code with Prettier"
    echo "  21) test                   - Run all tests"
    echo ""
    
    print_color $RED "⚡ KILL PORTS:"
    echo "  22) kill:13000             - Kill port 13000 (frontend)"
    echo "  23) kill:13001             - Kill port 13001 (backend)"
    echo "  24) kill:all               - Kill all dev ports"
    echo ""
    
    print_color $YELLOW "  0)  Exit"
    echo ""
    
    read -p "$(print_color $CYAN 'Select option (0-24): ')" choice
    
    case $choice in
        1)
            print_color $GREEN "🚀 Starting development (backend + frontend)..."
            run_in_terminal "Dev - Backend + Frontend" "cd $(pwd) && bun run dev:both"
            ;;
        2)
            print_color $GREEN "🚀 Starting backend..."
            run_in_terminal "Dev - Backend" "cd $(pwd) && bun run dev:backend"
            ;;
        3)
            print_color $GREEN "🚀 Starting frontend..."
            run_in_terminal "Dev - Frontend" "cd $(pwd) && bun run dev:frontend"
            ;;
        4)
            print_color $YELLOW "🏗️  Building project..."
            run_in_terminal "Build - Full" "cd $(pwd) && bun run build"
            ;;
        5)
            print_color $YELLOW "🏗️  Building backend..."
            run_in_terminal "Build - Backend" "cd $(pwd) && bun run build:backend"
            ;;
        6)
            print_color $YELLOW "🏗️  Building frontend..."
            run_in_terminal "Build - Frontend" "cd $(pwd) && bun run build:frontend"
            ;;
        7)
            print_color $CYAN "🗄️  Opening Prisma Studio..."
            run_in_terminal "Prisma Studio" "cd $(pwd) && bun run db:studio"
            ;;
        8)
            print_color $CYAN "🗄️  Running database migration..."
            run_in_terminal "DB Migrate" "cd $(pwd) && bun run db:migrate"
            ;;
        9)
            print_color $CYAN "🗄️  Pushing schema to database..."
            run_in_terminal "DB Push" "cd $(pwd) && bun run db:push"
            ;;
        10)
            print_color $CYAN "🗄️  Seeding database..."
            run_in_terminal "DB Seed" "cd $(pwd) && bun run db:seed"
            ;;
        11)
            print_color $CYAN "🗄️  Backing up database..."
            run_in_terminal "DB Backup" "cd $(pwd) && bun run db:backup"
            ;;
        12)
            print_color $CYAN "🗄️  Restoring database..."
            run_in_terminal "DB Restore" "cd $(pwd) && bun run db:restore"
            ;;
        13)
            print_color $RED "🐳 Starting Docker services..."
            run_in_terminal "Docker Up" "cd $(pwd) && docker-compose up"
            ;;
        14)
            print_color $RED "🐳 Stopping Docker services..."
            run_in_terminal "Docker Down" "cd $(pwd) && docker-compose down"
            ;;
        15)
            print_color $RED "🐳 Docker logs..."
            run_in_terminal "Docker Logs" "cd $(pwd) && docker-compose logs -f"
            ;;
        16)
            print_color $RED "🐳 Building Docker images..."
            run_in_terminal "Docker Build" "cd $(pwd) && docker-compose build"
            ;;
        17)
            print_color $GREEN "🔧 Installing dependencies..."
            run_in_terminal "Setup" "cd $(pwd) && bun run setup"
            ;;
        18)
            print_color $GREEN "🔧 Cleaning project..."
            run_in_terminal "Clean" "cd $(pwd) && bun run clean"
            ;;
        19)
            print_color $GREEN "🔧 Running linters..."
            run_in_terminal "Lint" "cd $(pwd) && bun run lint"
            ;;
        20)
            print_color $GREEN "🔧 Formatting code..."
            run_in_terminal "Format" "cd $(pwd) && bun run format"
            ;;
        21)
            print_color $GREEN "🔧 Running tests..."
            run_in_terminal "Test" "cd $(pwd) && bun run test"
            ;;
        22)
            print_color $RED "⚡ Killing process on port 13000..."
            $(pwd)/scripts/kill-ports.sh 13000
            sleep 1
            ;;
        23)
            print_color $RED "⚡ Killing process on port 13001..."
            $(pwd)/scripts/kill-ports.sh 13001
            sleep 1
            ;;
        24)
            print_color $RED "⚡ Killing all dev ports..."
            $(pwd)/scripts/kill-ports.sh 13000 13001
            sleep 1
            ;;
        0)
            print_color $YELLOW "👋 Goodbye!"
            exit 0
            ;;
        *)
            print_color $RED "❌ Invalid option. Please try again."
            sleep 2
            ;;
    esac
    
    echo ""
    read -p "$(print_color $CYAN 'Press Enter to continue...')"
    clear
done
