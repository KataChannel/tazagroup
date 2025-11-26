#!/bin/bash

# ============================================================================
# TAZAGROUP DEPLOYMENT - QUICK REFERENCE
# ============================================================================

cat << 'EOF'
╔════════════════════════════════════════════════════════════════════════════╗
║                    🚀 TAZAGROUP DEPLOYMENT GUIDE 🚀                        ║
╚════════════════════════════════════════════════════════════════════════════╝

📚 QUICK START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🎯 Option 1: Automatic (Recommended)
  ────────────────────────────────────────────────────────
  ./scripts/deploy-complete.sh
  
  → Chạy toàn bộ pipeline tự động:
    1. Build images locally
    2. Export và copy lên server
    3. Deploy trên server
    4. Cleanup (optional)


  🎯 Option 2: Manual (Step by step)
  ────────────────────────────────────────────────────────
  Step 1: ./scripts/deploy-1-build-local.sh
  Step 2: ./scripts/deploy-2-export-images.sh
  Step 3: ./scripts/deploy-3-deploy-server.sh local
  Step 4: ./scripts/deploy-4-cleanup.sh local


📋 SCRIPT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1️⃣  deploy-1-build-local.sh
  ────────────────────────────────────────────────────────
  • Build Docker images trên máy local
  • Tạo tags: tazagroup-backend:VERSION-TIMESTAMP
  • Output: .docker-image-tags file
  • Time: ~3-5 phút


  2️⃣  deploy-2-export-images.sh
  ────────────────────────────────────────────────────────
  • Export images sang .tar.gz
  • Compress để giảm size
  • Copy lên server qua SSH/rsync
  • Time: ~1-6 phút (depend on network)


  3️⃣  deploy-3-deploy-server.sh
  ────────────────────────────────────────────────────────
  • Load images trên server
  • Stop old containers
  • Start new containers
  • Verify deployment
  • Time: ~2 phút


  4️⃣  deploy-4-cleanup.sh
  ────────────────────────────────────────────────────────
  • Remove dangling images
  • Remove old containers
  • Remove unused volumes
  • Remove build cache
  • Modes: local | server


⚙️  CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Environment Variables:
  ────────────────────────────────────────────────────────
  export SERVER_USER="it"
  export SERVER_HOST="116.118.49.243"
  export SERVER_PATH="/home/it/tazagroup-deploy"


🔧 USEFUL COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Local:
  ────────────────────────────────────────────────────────
  docker images | grep tazagroup          # List images
  docker system df                        # Check disk usage
  ./scripts/deploy-4-cleanup.sh local     # Cleanup local


  Server (via SSH):
  ────────────────────────────────────────────────────────
  ssh user@server 'docker ps'                           # List containers
  ssh user@server 'cd ~/path && docker-compose logs'    # View logs
  ssh user@server 'cd ~/path && docker-compose restart' # Restart
  ./scripts/deploy-4-cleanup.sh server                  # Cleanup server


📊 PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Old Method vs New Method:
  ────────────────────────────────────────────────────────
  Build Time:     8-13 min → 3-5 min    (2.5x faster)
  Deploy Time:   10-16 min → 5-11 min   (1.5-2x faster)
  CPU Usage:      80-100% → 20-40%      (50-80% less)
  RAM Usage:      3-3.5GB → 1-2GB       (50% less)


🌐 ACCESS URLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Frontend:       http://116.118.49.243:13000
  Backend API:    http://116.118.49.243:13001
  GraphQL:        http://116.118.49.243:13001/graphql
  MinIO Console:  http://116.118.49.243:12008
  PgAdmin:        http://116.118.49.243:13002


🚨 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build Failed:
  ────────────────────────────────────────────────────────
  docker info                               # Check Docker
  cd frontend && bun run build:tazagroup    # Rebuild frontend
  cd backend && bun run build               # Rebuild backend


  Copy Failed:
  ────────────────────────────────────────────────────────
  ssh user@server                           # Test SSH
  ssh user@server 'df -h'                   # Check disk space
  ping server-ip                            # Test network


  Deploy Failed:
  ────────────────────────────────────────────────────────
  ssh user@server 'docker ps -a'            # Check containers
  ssh user@server 'docker logs container'   # Check logs
  ssh user@server 'docker-compose restart'  # Restart


  Rollback:
  ────────────────────────────────────────────────────────
  # On server:
  cd ~/tazagroup-deploy
  docker load -i backup/backend-OLD.tar.gz
  docker load -i backup/frontend-OLD.tar.gz
  docker-compose -f docker-compose.deploy.yml up -d


📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Full Guides:
  ────────────────────────────────────────────────────────
  • DEPLOYMENT-SYSTEM.md              - System overview
  • scripts/DEPLOYMENT-README.md      - Detailed guide
  • README.md                         - Main documentation


✅ BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Before Deploy:
  ────────────────────────────────────────────────────────
  ☑ Test changes locally
  ☑ Update VERSION file
  ☑ Commit and push code
  ☑ Backup database if needed
  ☑ Notify team


  After Deploy:
  ────────────────────────────────────────────────────────
  ☑ Verify frontend works
  ☑ Verify backend API
  ☑ Check logs for errors
  ☑ Test core features
  ☑ Run cleanup script


  Regular Maintenance:
  ────────────────────────────────────────────────────────
  ☑ Run cleanup weekly
  ☑ Monitor disk usage
  ☑ Keep 2-3 versions on server
  ☑ Backup images periodically


📞 SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Email:    support@tazagroup.vn
  Website:  https://tazagroup.vn
  Issues:   https://github.com/KataChannel/tazagroup/issues


╔════════════════════════════════════════════════════════════════════════════╗
║                     🎉 Happy Deploying! 🎉                                 ║
║              Made with ❤️ by TazaGroup Team                                ║
╚════════════════════════════════════════════════════════════════════════════╝

EOF
