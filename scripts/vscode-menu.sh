#!/bin/bash

# Simple Interactive Menu for VS Code Terminal
# Runs commands in current terminal session - TAZAGROUP ONLY

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

# Clear screen
clear

# Main menu
while true; do
    print_color $CYAN "╔════════════════════════════════════════════════════════════╗"
    print_color $CYAN "║          🚀 TAZAGROUP DEVELOPMENT MENU 🚀                 ║"
    print_color $CYAN "║      (Each command runs in current terminal)             ║"
    print_color $CYAN "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_color $GREEN "📦 DEVELOPMENT:"
    echo "  1)  dev                    - Run both backend + frontend"
    echo "  2)  dev:backend            - Run backend only (Port 13001)"
    echo "  3)  dev:frontend           - Run frontend only (Port 13000)"
    echo ""
    
    print_color $CYAN "🗄️  DATABASE OPERATIONS:"
    echo "  4)  db:studio              - Open Prisma Studio"
    echo "  5)  db:migrate             - Run database migration"
    echo "  6)  db:push                - Push schema to database"
    echo ""
    
    print_color $RED "🐳 DOCKER OPERATIONS:"
    echo "  7)  docker:up              - Start Docker services"
    echo "  8)  docker:down            - Stop Docker services"
    echo "  9)  docker:logs            - View Docker logs"
    echo "  17) docker:build           - Build without cache"
    echo "  18) docker:rebuild         - Down + Build + Up"
    echo "  19) docker:fresh           - Clean volumes + Build + Up"
    echo ""
    
    print_color $GREEN "🔧 UTILITIES:"
    echo "  10) lint                   - Run linters"
    echo "  11) format                 - Format code"
    echo "  12) test                   - Run tests"
    echo "  20) clean:build            - Clean all build artifacts (.next, dist)"
    echo ""
    
    print_color $RED "⚡ KILL PORTS:"
    echo "  13) kill:13000             - Kill port 13000 (frontend)"
    echo "  14) kill:13001             - Kill port 13001 (backend)"
    echo "  15) kill:all               - Kill all dev ports"
    echo ""
    
    print_color $PURPLE "🚀 DEPLOYMENT:"
    echo "  16) deploy:complete        - Full deployment (local build + server)"
    echo "  21) deploy:quick           - Quick deploy to server (no local build)"
    echo ""
    
    print_color $YELLOW "  0)  Exit"
    echo ""
    print_color $CYAN "💡 Tip: Use Ctrl+C to stop running services"
    echo ""
    
    read -p "$(print_color $CYAN 'Select option (0-16): ')" choice
    
    case $choice in
        1)
            print_color $GREEN "🚀 Starting development (backend + frontend)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            concurrently "cd backend && bun run dev" "cd frontend && bun run dev" --names "backend,frontend" --prefix-colors "blue,green"
            ;;
        2)
            print_color $GREEN "🚀 Starting backend (Port 13001)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:backend
            ;;
        3)
            print_color $GREEN "🚀 Starting frontend (Port 13000)..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run dev:frontend
            ;;
        4)
            print_color $CYAN "🗄️  Opening Prisma Studio..."
            print_color $YELLOW "Press Ctrl+C to stop"
            bun run db:studio
            ;;
        5)
            print_color $CYAN "🗄️  Running database migration..."
            bun run db:migrate
            ;;
        6)
            print_color $CYAN "🗄️  Pushing schema to database..."
            bun run db:push
            ;;
        7)
            print_color $RED "🐳 Starting Docker services..."
            docker-compose up -d
            print_color $GREEN "✅ Docker services started!"
            sleep 2
            ;;
        8)
            print_color $RED "🐳 Stopping Docker services..."
            docker-compose down
            print_color $GREEN "✅ Docker services stopped!"
            sleep 2
            ;;
        9)
            print_color $RED "🐳 Docker logs..."
            print_color $YELLOW "Press Ctrl+C to stop"
            docker-compose logs -f
            ;;
        10)
            print_color $GREEN "🔧 Running linters..."
            bun run lint
            ;;
        11)
            print_color $GREEN "🔧 Formatting code..."
            bun run format
            ;;
        12)
            print_color $GREEN "🔧 Running tests..."
            bun run test
            ;;
        13)
            print_color $RED "⚡ Killing process on port 13000..."
            $(pwd)/scripts/kill-ports.sh 13000
            sleep 1
            ;;
        14)
            print_color $RED "⚡ Killing process on port 13001..."
            $(pwd)/scripts/kill-ports.sh 13001
            sleep 1
            ;;
        15)
            print_color $RED "⚡ Killing all dev ports..."
            $(pwd)/scripts/kill-ports.sh 13000 13001
            sleep 1
            ;;
        16)
            print_color $PURPLE "🚀 Starting complete deployment..."
            print_color $YELLOW "This will build locally and deploy to server"
            $(pwd)/scripts/deploy-complete.sh
            ;;
        17)
            print_color $RED "🐳 Building Docker images (no cache)..."
            bun run docker:build
            print_color $GREEN "✅ Docker build complete!"
            sleep 2
            ;;
        18)
            print_color $RED "🐳 Full rebuild (down + build + up)..."
            bun run docker:rebuild
            print_color $GREEN "✅ Docker rebuild complete!"
            sleep 2
            ;;
        19)
            print_color $RED "🐳 Fresh start (clean volumes + build + up)..."
            print_color $YELLOW "⚠️  This will delete all volumes and data!"
            bun run docker:fresh
            print_color $GREEN "✅ Fresh Docker start complete!"
            sleep 2
            ;;
        20)
            print_color $GREEN "🔧 Cleaning build artifacts..."
            bun run clean:build
            print_color $GREEN "✅ Build artifacts cleaned!"
            sleep 2
            ;;
        21)
            print_color $PURPLE "🚀 Quick deploy to server..."
            print_color $YELLOW "Building and deploying directly on server"
            bun run deploy:quick
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
    read -p "$(print_color $CYAN 'Press Enter to return to menu...')"
    clear
done
